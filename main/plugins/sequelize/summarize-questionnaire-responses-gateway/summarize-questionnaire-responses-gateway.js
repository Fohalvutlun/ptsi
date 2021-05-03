import pkg from 'sequelize';
const { Op } = pkg;

export default function makeSummarizeQuestionnaireResponsesGateway({
    Time,
    SchoolGrouping,
    RespondentProfile,
    QuestionnaireResponse,
    Submission
}) {

    const gateway = {
        countQuestionnaireSubmissions,
        countSubmissionsForEachRiskLevel,
        countSubmissionsForEachGender,
        countSubmissionsForEachAge,
        countAnswerChoiceForEachQuestion
    };
    return Object.freeze(gateway);

    async function countQuestionnaireSubmissions() {
        const count = await Submission.count({ attributes: ['submissionId'] });
        return count;
    }

    async function countSubmissionsForEachRiskLevel(filterRequest) {
        const include = prepareIncludesAsNeeded(filterRequest);
        const countRecords = await Submission.count({ group: ['risk'], include });
        return convertSequelizeCountRecordsIntoMap(countRecords, 'risk');
    }

    async function countSubmissionsForEachGender() {
        const countRecords = await RespondentProfile.count({ group: ['gender'], include: [{ model: Submission, attributes: ['submissionId'] }] });
        return convertSequelizeCountRecordsIntoMap(countRecords, 'gender');
    }

    async function countSubmissionsForEachAge() {
        const countRecords = await RespondentProfile.count({ group: ['age'], include: [{ model: Submission, attributes: ['submissionId'] }] });
        return convertSequelizeCountRecordsIntoMap(countRecords, 'age');
    }

    async function countAnswerChoiceForEachQuestion(questionSet = []) {
        const responseSegments = await Promise.all(questionSet.map((question) => countAnswerChoicesResponseForQuestion(question)));
        return new Map(responseSegments);
    }

    // Helpers
    function prepareIncludesAsNeeded(filterRequest) {
        let include = [];

        if (filterRequest) {
            include = addRespondentProfileModelIfNeeded(include, filterRequest.respondentProfile.age, filterRequest.respondentProfile.gender);
            include = addSchoolGroupingModelIfNeeded(include, filterRequest.schoolGroupingCode);
            include = addTimeModelIfNeeded(include, filterRequest.submissionDate);
        }

        return include;
    }

    function addRespondentProfileModelIfNeeded(includeArray, age, gender) {
        const where = {};
        if (age) {
            where.age = age;
        }
        if (gender) {
            where.gender = gender;
        }

        return where === {} ? includeArray : includeArray.concat([{ model: RespondentProfile, where }]);
    }

    function addSchoolGroupingModelIfNeeded(includeArray, schoolGroupingCode) {
        const where = {};
        if (schoolGroupingCode) {
            where.schoolGroupingCode = schoolGroupingCode;
        }
        return where === {} ? includeArray : includeArray.concat([{ model: SchoolGrouping, where }]);
    }

    function addTimeModelIfNeeded(includeArray, date) {
        const where = {};
        if (date) {
            where.year = { [Op.lte]: date.getFullYear() }
            where.month = { [Op.lte]: date.getMonth() + 1 }
        }
        return where === {} ? includeArray : includeArray.concat([{ model: Time, where }]);
    }

    function convertSequelizeCountRecordsIntoMap(records, keyAttrName) {
        const kvPairs = records.map((record) => [record[keyAttrName], record.count]);
        return new Map(kvPairs);
    }

    async function countAnswerChoicesResponseForQuestion(questionNum) {
        const countRecords = await countAnswerChoiceFor(questionNum);
        return [questionNum, countRecords];
    }

    async function countAnswerChoiceFor(questionNum) {
        const columnName = `questionNo${questionNum}`;
        const countRecords = await QuestionnaireResponse.count({ where: { [columnName]: { [Op.not]: null } }, group: [columnName] });
        return convertSequelizeCountRecordsIntoMap(countRecords, columnName);
    }
}