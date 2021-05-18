import { strict as assert } from 'assert';
import Sequelize from 'sequelize';

import makeSummarizeQuestionGateway from '../../main/plugins/sequelize/summarize-question-gateway/summarize-question-gateway.js';
import makeSequelizeModels from '../../main/plugins/sequelize/models/index.js';

import makeCountGatewayRequestBuilder from '../../main/core/summarize-question/models/gateway-count-request-model.js';

export default async function testSummarizeQuestionGateway(test_counter = 0) {
    const sequelize = new Sequelize('sqlite::memory:', { logging: false });
    const models = makeSequelizeModels(sequelize);
    await sequelize.sync({ force: true });

    const summarizeQuestionGateway = makeSummarizeQuestionGateway(models);
    const dbRecords = await createDBRecords(models);

    
    await testCountAnswerChoicesForQuestionByQuestionnaireNoFilter()
    await testCountAnswerChoicesForQuestionByQuestionnaireWithFilter()

    return  test_counter;


    async function testCountAnswerChoicesForQuestionByQuestionnaireNoFilter() {
        const questionMin = 1, questionMax = 6;

        for (let i = questionMin; i <= questionMax; i++) {
            await testForFilter(i, null, null, null, null);
            test_counter++;
        }
    }

    async function testCountAnswerChoicesForQuestionByQuestionnaireWithFilter() {
        const questionMin = 1, questionMax = 6;
        const dates = [new Date(0), new Date(), new Date(2000, 0, 1)];
        const minAge = 6, maxAge = 12;
        const genders = ['f', 'm'];
        const schoolGroupings = dbRecords.schoolGrouping.map((record) => record.schoolGroupingCode);

        for (let sc of schoolGroupings) {
            for (let g of genders) {
                for (let d of dates) {
                    for (let age = minAge; age <= maxAge; age++) {
                        for (let q = questionMin; q <= questionMax; q++) {
                            await testForFilter(q, d, age, g, sc);
                            test_counter++;
                        }
                    }
                }
            }
        }

    }

    async function testForFilter(question, date, age, gender, schoolGrouping) {
        const
            filter = makeMockRequestModel(question, date, age, gender, schoolGrouping),
            result = await summarizeQuestionGateway.countAnswerChoicesForQuestionByQuestionnaire(filter),
            expected = makeExpected(question, date, age, gender, schoolGrouping);

        assert.deepStrictEqual(new Set(result), new Set(expected));
    }

    function makeExpected(question, date, age, gender, schoolGrouping) {
        const uncleanTotalsMap = dbRecords.submission.reduce((acc, submission) =>
            matchesFilter(submission, date, age, gender, schoolGrouping) ? addCountsForSubmission(acc, submission.submissionId, question) : acc,
            new Map);
        return makeOutput(Array.from(uncleanTotalsMap.entries()));
    }

    function matchesFilter(submission, date, age, gender, schoolGroupingCode) {
        return (
            timeLowerThan(submission, date)
            && matchesRespondentProfile(submission, gender, age)
            && matchesSchoolGrouping(submission, schoolGroupingCode)
        );
    }

    function timeLowerThan(submission, providedDate) {
        return dbRecords.time.findIndex(({ timeId, year, month }) =>
            timeId === submission.timeId
            && (
                providedDate === null
                || (
                    year < providedDate.getFullYear()
                    || (
                        year === providedDate.getFullYear()
                        && month <= providedDate.getMonth() + 1
                    )
                )
            )
        ) >= 0;
    }

    function matchesRespondentProfile(submission, providedGender, providedAge) {
        return dbRecords.respondentProfile.findIndex(({ profileId, gender, age }) =>
            profileId === submission.respondentProfileId
            && (providedGender === null
                || gender === providedGender)
            && (providedAge === null
                || age === providedAge)
        ) >= 0;
    }

    function matchesSchoolGrouping(submission, providedSchoolGrouping) {
        return dbRecords.schoolGrouping.findIndex(({ schoolGroupingId, schoolGroupingCode }) =>
            schoolGroupingId === submission.schoolGroupingId
            && (providedSchoolGrouping === null
                || schoolGroupingCode === providedSchoolGrouping)
        ) >= 0;
    }

    function addCountsForSubmission(totalsMap, submissionId, questionNumber) {
        return dbRecords.questionnaireResponse.reduce((acc, res) =>
            res.submissionId === submissionId && res[`questionNo${questionNumber}`] !== null ? addCountsForResponse(acc, res, questionNumber) : acc
            , totalsMap);
    }

    function addCountsForResponse(accMap, questionnaireResponse, questionNumber) {
        const q = dbRecords.questionnaire.find(q => questionnaireResponse.questionnaireId === q.questionnaireId);
        return accMap.has(q.questionnaireCode) ?
            accMap.set(q.questionnaireCode, tallyValue(accMap.get(q.questionnaireCode), questionnaireResponse[`questionNo${questionNumber}`])) :
            accMap.set(q.questionnaireCode, tallyValue(new Map(), questionnaireResponse[`questionNo${questionNumber}`]));
    }

    function makeOutput(uncleanTotalsEntries) {
        return uncleanTotalsEntries.reduce((acc, [questionnaireCode, choicesTotalMap]) =>
            addToOutputArray(acc, questionnaireCode, Array.from(choicesTotalMap.entries()))
            , []);
    }

    function addToOutputArray(acc, questionnaireCode, choiceTotalsEntries) {
        return choiceTotalsEntries.reduce((acc, [choiceAnswer, count]) =>
            acc.concat([{ questionnaireCode, choiceAnswer, count }])
            , acc);
    }
}

function tallyValue(acc, value) {
    return acc.has(value) ? acc.set(value, acc.get(value) + 1) : acc.set(value, 1);
}

function makeMockRequestModel(questionNum, date, age, gender, schoolGrouping) {
    return makeCountGatewayRequestBuilder()
        .setRespodentProfile(age, gender)
        .setSchoolGrouping(schoolGrouping)
        .setSubmissionDate(date)
        .setQuestion(questionNum)
        .makeGatewayRequest();
}

// Mock Records
async function createDBRecords(models) {
    const insertedRecords = {
        questionnaire: [],
        time: [],
        schoolGrouping: [],
        respondentProfile: [],
        submission: [],
        questionnaireResponse: []
    };

    const q1 = await mockQuestionnaireModel("Q1", "1");
    const q3 = await mockQuestionnaireModel("Q3", "3");

    const t1 = await mockTimeModel(1, 1, 1970);
    const t2 = await mockTimeModel(4, 12, 2019);
    const t3 = await mockTimeModel(25, 3, 2000);

    const sg1 = await mockSchoolGroupingModel("AET", "Agrupamento de Escolas de Teste", "test@aet.com", "912345678");
    const sg2 = await mockSchoolGroupingModel("AET2", "Agrupamento de Escolas Número 2 de Teste", "test@aet2.com", "922345677");

    const rp1 = await mockRespondentProfileModel(7, "f");
    const rp2 = await mockRespondentProfileModel(8, "m");
    const rp3 = await mockRespondentProfileModel(8, "f");
    const rp4 = await mockRespondentProfileModel(12, "m");
    const rp5 = await mockRespondentProfileModel(11, "f");

    const s1 = await mockSubmissionModel(3, t1, sg1, rp1);
    const s2 = await mockSubmissionModel(2, t1, sg1, rp2);
    const s3 = await mockSubmissionModel(2, t1, sg2, rp3);
    const s4 = await mockSubmissionModel(2, t2, sg1, rp4);
    const s5 = await mockSubmissionModel(1, t3, sg2, rp5);

    await mockQuestionnaireResponseModel(1, 1, 3, 1, 2, 3, 2, q1, s1);
    await mockQuestionnaireResponseModel(3, 2, 1, 3, null, 5, 3, q1, s2);
    await mockQuestionnaireResponseModel(3, null, 2, 2, 2, 1, 3, q1, s3);
    await mockQuestionnaireResponseModel(2, null, null, 2, null, null, 1, q3, s4);
    await mockQuestionnaireResponseModel(3, 1, null, 3, 4, 3, 1, q3, s5);

    await mockQuestionnaireResponseModel(1, 1, 3, 1, 2, 3, 2, q1, s1);
    await mockQuestionnaireResponseModel(3, 2, 1, 3, null, 5, 3, q1, s2);
    await mockQuestionnaireResponseModel(3, null, 2, 2, 2, 1, 3, q1, s3);
    await mockQuestionnaireResponseModel(2, null, null, 2, null, null, 1, q3, s4);
    await mockQuestionnaireResponseModel(3, 1, null, 3, 4, 3, 1, q3, s5);

    return insertedRecords;



    async function mockQuestionnaireModel(designation, questionnaireCode) {
        const m = await models.Questionnaire.create({ designation, questionnaireCode });
        insertedRecords.questionnaire.push(m);
        return m;
    }
    async function mockTimeModel(day, month, year) {
        const m = await models.Time.create({ day, month, year });
        insertedRecords.time.push(m);
        return m;
    }
    async function mockSchoolGroupingModel(schoolGroupingCode, name, email, phoneNumber) {
        const m = await models.SchoolGrouping.create({ schoolGroupingCode, name, email, phoneNumber });
        insertedRecords.schoolGrouping.push(m);
        return m;
    }
    async function mockRespondentProfileModel(age, gender) {
        const m = await models.RespondentProfile.create({ age, gender });
        insertedRecords.respondentProfile.push(m);
        return m;
    }
    async function mockSubmissionModel(risk, time, schoolGrouping, respondentProfile) {
        const m = await models.Submission.create({
            risk,
            timeId: time.timeId,
            schoolGroupingId: schoolGrouping.schoolGroupingId,
            respondentProfileId: respondentProfile.profileId
        });
        insertedRecords.submission.push(m);
        return m;
    }
    async function mockQuestionnaireResponseModel(questionNo1, questionNo2, questionNo3, questionNo4, questionNo5, questionNo6, risk, questionnaire, submission) {
        const m = await models.QuestionnaireResponse.create({
            questionNo1, questionNo2, questionNo3, questionNo4, questionNo5, questionNo6,
            risk,
            questionnaireId: questionnaire.questionnaireId,
            submissionId: submission.submissionId
        });
        insertedRecords.questionnaireResponse.push(m);
        return m;
    }
}