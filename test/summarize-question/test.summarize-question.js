import { strict as assert } from 'assert';

import makeSummarizeQuestion from '../../main/core/summarize-question/summarize-question.js';
import makeSummarizeRequestBuilder from '../../main/core/summarize-question/models/summarize-question-request-model.js';

export default async function testSummarizeQuestion(test_counter = 0) {
    const dummyValues = makeDummyValues();
    const stubs = makeInteractorStubs(dummyValues);
    const summarizeQuestion = makeSummarizeQuestion(stubs);

    await testWithFilterSummarize();
    await testNoFilterSummarize();

    return test_counter;

    async function testWithFilterSummarize() {
        const expected = dummyValues;
        const questionMin = 1, questionMax = 6;
        const dates = [new Date(0), new Date(), new Date(2000, 0, 1)];
        const minAge = 6, maxAge = 12;
        const genders = ['f', 'm'];
        const schoolGroupings = ["a string"];

        for (let sc of schoolGroupings) {
            for (let g of genders) {
                for (let d of dates) {
                    for (let age = minAge; age <= maxAge; age++) {
                        for (let q = questionMin; q <= questionMax; q++) {
                            expected.questionNumber = q;
                            await testForInput(q, d, age, g, sc, expected);
                            test_counter++;
                        }
                    }
                }
            }
        }
    }

    async function testNoFilterSummarize() {
        const expected = dummyValues;
        const questionMin = 1, questionMax = 6;

        for (let q = questionMin; q <= questionMax; q++) {
            expected.questionNumber = q;
            await testForInput(q, null, null, null, null, expected);
            test_counter++;
        }
    }

    async function testForInput(question, date, age, gender, schoolGrouping, expected) {
        const input = makeMockRequestModel(question, date, age, gender, schoolGrouping);
        const response = await summarizeQuestion.summarize(input);

        assert.deepStrictEqual(response, expected);
    }
}

function makeMockRequestModel(question, date, age, gender, schoolGrouping) {
    return makeSummarizeRequestBuilder()
        .setDateFilter(date)
        .setRespondentProfileFilter(age, gender)
        .setSchoolGroupingFilter(schoolGrouping)
        .setQuestion(question)
        .makeSummarizeQuestionRequest();
}

function makeDummyValues() {
    return {
        questionNumber: null,
        questionSummary: {
            answerChoiceAndQuestionnairePairTotals: [
                { choiceNumber: 1, questionnaireCode: 1, total: 3 },
                { choiceNumber: 1, questionnaireCode: 2, total: 1 },
                { choiceNumber: 2, questionnaireCode: 2, total: 6 },
                { choiceNumber: 5, questionnaireCode: 1, total: 1 }
            ]
        }
    };
}

function makeInteractorStubs(dummyValues) {
    return {
        summarizeQuestionRequestValidator: { isValid: () => true },
        summarizeQuestionGateway: {
            countAnswerChoicesForQuestionByQuestionnaire: () =>
                dummyValues.questionSummary.answerChoiceAndQuestionnairePairTotals.map(({ choiceNumber, questionnaireCode, total }) => Object.assign({}, {
                    questionnaireCode,
                    choiceAnswer: choiceNumber,
                    count: total
                }))
        },
        summarizeQuestionOutputPort: {
            prepareFailView: (o) => o,
            prepareSuccessView: (o) => o
        }
    };
}