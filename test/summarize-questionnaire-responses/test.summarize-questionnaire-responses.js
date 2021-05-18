import { strict as assert } from 'assert';

import makeSummarizeQuestionnaireResponses from '../../main/core/summarize-questionnaire-responses/summarize-questionnaire-responses.js';
import makeSummarizeRequestBuilder from '../../main/core/summarize-questionnaire-responses/models/summarize-request-model.js';

export default async function testSummarizeQuestionnaireResponses(test_counter = 0) {
    const dummyValues = makeDummyValues();
    const stubs = makeInteractorStubs(dummyValues);
    const summarizeQuestionnaireResponses = makeSummarizeQuestionnaireResponses(stubs);

    await testNoFilterSummarize();
    await testWithFilterSummarize();

    return test_counter;

    async function testWithFilterSummarize() {
        const expected = {
            totalSubmissions: dummyValues.total,
            totalSubmissionsByRiskLevel: dummyValues.totalRisk,
            totalSubmissionsByGender: dummyValues.totalGender,
            totalSubmissionsByAge: dummyValues.totalAge,
            totalResponsesByChoiceToReactionQuestions: dummyValues.totalAnswers,
            totalFilteredSubmissionsByRiskLevel: dummyValues.totalRisk
        };

        const dates = [new Date(0), new Date(), new Date(2000, 0, 1)];
        const minAge = 6, maxAge = 12;
        const genders = ['f', 'm'];
        const schoolGroupings = ["a string"];

        for (let sc of schoolGroupings) {
            for (let g of genders) {
                for (let d of dates) {
                    for (let age = minAge; age <= maxAge; age++) {
                        await testForInput(d, age, g, sc, expected);
                        test_counter++;
                    }
                }
            }
        }
    }

    async function testNoFilterSummarize() {
        const expected = {
            totalSubmissions: dummyValues.total,
            totalSubmissionsByRiskLevel: dummyValues.totalRisk,
            totalSubmissionsByGender: dummyValues.totalGender,
            totalSubmissionsByAge: dummyValues.totalAge,
            totalResponsesByChoiceToReactionQuestions: dummyValues.totalAnswers,
            totalFilteredSubmissionsByRiskLevel: dummyValues.totalRisk
        };

        await testForInput(null, null, null, null, expected);
        test_counter++;
    }

    async function testForInput(date, age, gender, schoolGrouping, expected) {
        const input = makeMockRequestModel(date, age, gender, schoolGrouping);
        const response = await summarizeQuestionnaireResponses.summarize(input);
        assert.deepStrictEqual(response, expected);
    }
}

function makeMockRequestModel(date, age, gender, schoolGrouping) {
    return makeSummarizeRequestBuilder().setDate(date).setRespondent(age, gender, schoolGrouping).makeSummarizeRequest();
}

function makeDummyValues() {
    return {
        total: 20,
        totalRisk: new Map([[1, 13], [2, 4], [3, 3]]),
        totalGender: new Map([['f', 9], ['m', 11]]),
        totalAge: new Map([[6, 3], [7, 1], [8, 7], [9, 5], [10, 2], [11, 1], [12, 1]]),
        totalAnswers: new Map([
            [2, [[1, 2], [3, 3]]],
            [3, [[1, 1], [2, 2], [3, 2]]],
            [5, [[1, 12]]],
            [6, [[1, 3], [3, 5]]]
        ])
    };
}

function makeInteractorStubs(dummyValues) {
    return {
        summarizeRequestValidator: { isValid: () => true },
        summarizeQuestionnaireResponsesGateway: {
            countQuestionnaireSubmissions: () => dummyValues.total,
            countSubmissionsForEachRiskLevel: (filter) => dummyValues.totalRisk,
            countSubmissionsForEachGender: () => dummyValues.totalGender,
            countSubmissionsForEachAge: () => dummyValues.totalAge,
            countAnswerChoiceForEachQuestion: () => dummyValues.totalAnswers
        },
        summarizeQuestionnaireResponsesOutputPort: {
            prepareFailView: (o) => o,
            prepareSuccessView: (o) => o
        }
    };
}