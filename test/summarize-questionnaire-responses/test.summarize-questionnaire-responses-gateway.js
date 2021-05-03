import { strict as assert } from 'assert';
import { Sequelize } from 'sequelize';

import makeSubmitQuestionnaireResponsesGateway from '../../main/plugins/sequelize/summarize-questionnaire-responses-gateway/summarize-questionnaire-responses-gateway.js';
import makeSequelizeModels from '../../main/plugins/sequelize/models/index.js';

import makeFilterGatewayRequestBuilder from '../../main/core/summarize-questionnaire-responses/models/gateway-filter-request-model.js';

// vvv Run Tests here vvv
export default async function testSummarizeQuestionnaireResponsesGateway(test_counter = 0) {
    const sequelize = new Sequelize('sqlite::memory:', { logging: false });
    const models = makeSequelizeModels(sequelize);
    await sequelize.sync({ force: true });

    const submitQuestionnaireResponseGateway = makeSubmitQuestionnaireResponsesGateway(models);
    const dbRecords = await createDBRecords(models);

    await testCountQuestionnaireSubmissions();
    await testCountSubmissionsForEachRiskLevelWithoutFilter();
    await testCountSubmissionsForEachRiskLevelWithFilter()
    await testCountSubmissionsForEachGender();
    await testCountSubmissionsForEachAge();
    await testCountAnswerChoiceForEachQuestionForAllQuestionCombos();

    return test_counter;

    async function testCountQuestionnaireSubmissions() {
        const result = await submitQuestionnaireResponseGateway.countQuestionnaireSubmissions();
        assert.strictEqual(result, dbRecords.submission.length);
        test_counter++;
    }

    async function testCountSubmissionsForEachRiskLevelWithoutFilter() {
        const
            result = await submitQuestionnaireResponseGateway.countSubmissionsForEachRiskLevel(),
            expected = dbRecords.submission.reduce((acc, submission) => tallyValue(acc, submission.risk), new Map());

        assert.deepStrictEqual(result, expected);
        test_counter++;
    }

    async function testCountSubmissionsForEachRiskLevelWithFilter() {
        const dates = [new Date(0), new Date(), new Date(2000, 0, 1)];
        const minAge = 6, maxAge = 12;
        const genders = ['f', 'm'];
        const schoolGroupings = dbRecords.schoolGrouping.map((record) => record.schoolGroupingCode);

        for (let sc of schoolGroupings) {
            for (let g of genders) {
                for (let d of dates) {
                    for (let age = minAge; age <= maxAge; age++) {
                        await testForFilter(d, age, g, sc);
                        test_counter++;
                    }
                }
            }
        }

        async function testForFilter(date, age, gender, schoolGrouping) {
            const
                filter = makeMockRequestModel(date, age, gender, schoolGrouping),
                result = await submitQuestionnaireResponseGateway.countSubmissionsForEachRiskLevel(filter),
                expected = makeExpected(date, age, gender, schoolGrouping);

            assert.deepStrictEqual(result, expected);
        }

        function makeMockRequestModel(date, age, gender, schoolGrouping) {
            return makeFilterGatewayRequestBuilder()
                .setSubmissionDate(date)
                .setSchoolGrouping(schoolGrouping)
                .setRespodentProfile(age, gender)
                .makeGatewayRequest();
        }

        function makeExpected(date, age, gender, schoolGrouping) {
            return dbRecords.submission.reduce((acc, submission) =>
                matchesFilter(submission, date, age, gender, schoolGrouping) ? tallyValue(acc, submission.risk) : acc,
                new Map());
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
                && year <= providedDate.getFullYear()
                && month <= providedDate.getMonth() + 1
            ) >= 0;
        }
        
        function matchesRespondentProfile(submission, providedGender, providedAge) {
            return dbRecords.respondentProfile.findIndex(({ profileId, gender, age }) =>
                profileId === submission.respondentProfileId
                && gender === providedGender
                && age === providedAge
            ) >= 0;
        }

        function matchesSchoolGrouping(submission, providedSchoolGrouping) {
            return dbRecords.schoolGrouping.findIndex(({ schoolGroupingId, schoolGroupingCode }) =>
                schoolGroupingId === submission.schoolGroupingId
                && schoolGroupingCode === providedSchoolGrouping
            ) >= 0;
        }
    }

    async function testCountSubmissionsForEachGender() {
        const
            result = await submitQuestionnaireResponseGateway.countSubmissionsForEachGender(),
            expected = dbRecords.submission.reduce((acc, submission) => tallyValue(acc, getGender(submission)), new Map());

        assert.deepStrictEqual(result, expected);
        test_counter++;

        function getGender(submission) {
            return dbRecords.respondentProfile.find(({ profileId }) => profileId === submission.respondentProfileId).gender;
        }
    }

    async function testCountSubmissionsForEachAge() {
        const
            result = await submitQuestionnaireResponseGateway.countSubmissionsForEachAge(),
            expected = dbRecords.submission.reduce((acc, submission) => tallyValue(acc, getSubmissionAge(submission)), new Map());

        assert.deepStrictEqual(result, expected);
        test_counter++;

        function getSubmissionAge(submission) {
            return dbRecords.respondentProfile.find(({ profileId }) =>
                profileId === submission.respondentProfileId).age;

        }
    }

    async function testCountAnswerChoiceForEachQuestionForAllQuestionCombos() {
        const availableQuestions = [1, 2, 3, 4, 5, 6];
        const questionSubsets = subsets(availableQuestions);

        for (let questions of questionSubsets) {
            await testQuestionCombination(questions);
            test_counter++;
        }

        async function testQuestionCombination(questions) {
            const
                result = await submitQuestionnaireResponseGateway.countAnswerChoiceForEachQuestion(questions),
                expected = questions.reduce((acc, question) =>
                    acc.set(question, dbRecords.questionnaireRespose.reduce((acc, record) =>
                        record[`questionNo${question}`] ? tallyValue(acc, record[`questionNo${question}`]) : acc,
                        new Map())),
                    new Map());

            assert.deepStrictEqual(result, expected);
        }
    }
}
// Mock Records
async function createDBRecords(models) {
    const insertedRecords = {
        questionnaire: [],
        time: [],
        schoolGrouping: [],
        respondentProfile: [],
        submission: [],
        questionnaireRespose: []
    };

    const q1 = await mockQuestionnaireModel("Q1", 1);
    const q2 = await mockQuestionnaireModel("Q3", 3);

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

    await mockResponseModel(1, 1, 3, 1, 2, 3, 2, q1, s1);
    await mockResponseModel(3, 2, 1, 3, null, 5, 3, q1, s2);
    await mockResponseModel(3, null, 2, 2, 2, 1, 3, q1, s3);
    await mockResponseModel(2, null, null, 2, null, null, 1, q2, s4);
    await mockResponseModel(3, 1, null, 3, 4, 3, 1, q2, s5);

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
    async function mockResponseModel(questionNo1, questionNo2, questionNo3, questionNo4, questionNo5, questionNo6, risk, questionnaire, submission) {
        const m = await models.QuestionnaireResponse.create({
            questionNo1, questionNo2, questionNo3, questionNo4, questionNo5, questionNo6,
            risk,
            questionnaireId: questionnaire.questionnaireId,
            submissionId: submission.submissionId
        });
        insertedRecords.questionnaireRespose.push(m);
        return m;
    }
}
// Helpers
function tallyValue(acc, value) {
    return acc.has(value) ? acc.set(value, acc.get(value) + 1) : acc.set(value, 1);
}

function subsets(arr = []) {
    /*
    *  https://stackoverflow.com/questions/42773836/how-to-find-all-subsets-of-a-set-in-javascript
    */
    return arr.reduce((subsets, value) =>
        subsets.concat(subsets.map(set => [value, ...set])),
        [[]]);
};

