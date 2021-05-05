import Sequelize from 'sequelize';
const { Op } = Sequelize;

export default function makeSummarizeQuestionGateway({
    Time,
    SchoolGrouping,
    RespondentProfile,
    QuestionnaireResponse,
    Questionnaire,
    Submission
}) {

    return Object.freeze({
        countAnswerChoicesForQuestionByQuestionnaire
    });

    async function countAnswerChoicesForQuestionByQuestionnaire(countRequest) {
        const questionAttrName = `questionNo${countRequest.questionNumber}`;
        const countResult = await QuestionnaireResponse.count({
            attributes: setCountAttributes(),
            group: makeGroupClause(questionAttrName),
            include: prepareIncludes(countRequest),
            where: { [questionAttrName]: { [Op.ne]: null } },
            raw: true
        });
        return prepareGatewayResponse(countResult, questionAttrName);
    }

    // Helpers
    function setCountAttributes() {
        return [[Sequelize.col(getDBFullColumnName(Questionnaire, 'questionnaireCode')), 'questionnaireCode']];
    }

    function makeGroupClause(questionAttrName) {
        return [questionAttrName, getDBFullColumnName(Questionnaire, 'questionnaireCode')];
    }

    function getDBFullColumnName(model, attr) {
        return `${model.options.name.singular}.${model.tableAttributes[attr].field}`
    }

    function prepareIncludes(countRequest) {
        let includes = [], submissionIncludes = [];

        if (countRequest) {
            const { schoolGroupingCode, submissionDate, respondentProfile } = countRequest;
            submissionIncludes = addRespondentProfileModelIfNeeded(submissionIncludes, respondentProfile.age, respondentProfile.gender);
            submissionIncludes = addSchoolGroupingModelIfNeeded(submissionIncludes, schoolGroupingCode);
            submissionIncludes = addTimeModelIfNeeded(submissionIncludes, submissionDate);
        }

        includes = addSubmissionModelIfNeeded(includes, submissionIncludes)
        includes = addQuestionnaireModel(includes);
        return includes;
    }

    function addRespondentProfileModelIfNeeded(includeArray, age, gender) {
        const where = {};
        if (age) {
            where.age = age;
        }
        if (gender) {
            where.gender = gender;
        }
        return addWhereClauseToIncludeIfNeeded(includeArray, RespondentProfile, where);
    }

    function addSchoolGroupingModelIfNeeded(includeArray, schoolGroupingCode) {
        const where = {};
        if (schoolGroupingCode) {
            where.schoolGroupingCode = schoolGroupingCode;
        }
        return addWhereClauseToIncludeIfNeeded(includeArray, SchoolGrouping, where);
    }

    function addTimeModelIfNeeded(includeArray, date) {
        let where = {};
        if (date) {
            where[Op.or] = {
                year: { [Op.lt]: date.getFullYear() },
                [Op.and]: {
                    month: { [Op.lte]: date.getMonth() + 1 },
                    year: { [Op.eq]: date.getFullYear() }
                }
            }
        }
        return addWhereClauseToIncludeIfNeeded(includeArray, Time, where);
    }

    function addSubmissionModelIfNeeded(includeArray, submissionIncludeArray) {
        return submissionIncludeArray.length > 0 ?
            includeArray.concat([
                Object.assign(includeModelTemplate(Submission), { include: submissionIncludeArray })
            ]) :
            includeArray
    }

    function addQuestionnaireModel(includeArray) {
        return includeArray.concat([includeModelTemplate(Questionnaire)]);
    }

    function includeModelTemplate(model) {
        return { model, attributes: [], required: true }
    }

    function addWhereClauseToIncludeIfNeeded(includeArray, model, whereClause) {
        return whereClause === {} || !whereClause ?
            includeArray :
            includeArray.concat([
                Object.assign(includeModelTemplate(model), { where: whereClause })
            ]);
    }

    function prepareGatewayResponse(choiceCountArray, questionAttrName) {
        return choiceCountArray.map((choiceCount) => Object.freeze({
            questionnaireCode: choiceCount.questionnaireCode,
            choiceAnswer: choiceCount[questionAttrName],
            count: choiceCount.count
        }));
    }
}