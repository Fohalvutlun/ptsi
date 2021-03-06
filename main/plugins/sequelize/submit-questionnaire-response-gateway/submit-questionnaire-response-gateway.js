export default function makeSubmitQuestionnaireResponseGateway({
    Time,
    SchoolGrouping,
    RespondentProfile,
    QuestionnaireResponse,
    Questionnaire,
    Submission
}) {

    const gateway = {
        insert,
        getQuestionnaireWithCodeEqualTo,
        getSchoolGroupingWithCodeEqualTo
    }
    return Object.freeze(gateway);

    async function insert({ respondent, momentOfSubmission, submissionRiskProfile, questionnaireResponses }) {
        const
            schoolGroupingModel = await SchoolGrouping.findOne({ where: { schoolGroupingCode: respondent.schoolGrouping.code } }),
            respodentProfileModel = await makeRespodentProfileModel(respondent.age, respondent.gender),
            timeModel = await makeTimeModel(momentOfSubmission);

        await saveQuestionnaireResponses(
            questionnaireResponses,
            submissionRiskProfile,
            respodentProfileModel.profileId,
            schoolGroupingModel.schoolGroupingId,
            timeModel.timeId
        );

        return { respondent, momentOfSubmission, questionnaireResponses };
    }

    async function getQuestionnaireWithCodeEqualTo(code) {
        const questionnaireModel = await Questionnaire.findOne({ where: { questionnaireCode: code } });
        return makeQuestionnaireData(questionnaireModel);

    }

    async function getSchoolGroupingWithCodeEqualTo(code) {
        const schoolGroupingModel = await SchoolGrouping.findOne({ where: { schoolGroupingCode: code } });
        return makeSchoolGroupingData(schoolGroupingModel);
    }

    async function makeTimeModel(momentOfSubmission) {
        const [timeModel, _] = await Time.findCreateFind({
            where: {
                day: momentOfSubmission.getDate(),
                month: momentOfSubmission.getMonth() + 1, //Javascript month starts at 0
                year: momentOfSubmission.getFullYear()
            }
        });

        return timeModel;
    }

    async function makeRespodentProfileModel(age, gender) {
        const [respodentProfileModel, _] = await RespondentProfile.findCreateFind({
            where: { age, gender }
        });

        return respodentProfileModel;
    }

    async function saveQuestionnaireResponses(questionnaireResponses, submissionRiskProfile, respondentProfileId, schoolGroupingId, timeId) {
        await Submission.sequelize.transaction(async (transaction) => {
            const submission = await Submission.create({
                risk: submissionRiskProfile.level,
                timeId,
                schoolGroupingId,
                respondentProfileId,
            }, { transaction });
            for (let questionnaireResponse of questionnaireResponses) {
                const questionnaire = await Questionnaire.findOne({ where: { questionnaireCode: questionnaireResponse.questionnaire.code } });

                await saveOneQuestionnaireResponse(
                    questionnaireResponse,
                    submission.submissionId,
                    questionnaire.questionnaireId,
                    transaction
                );
            }
        });
    }

    async function saveOneQuestionnaireResponse(questionnaireResponse, submissionId, questionnaireId, transaction) {
        return await QuestionnaireResponse.create({
            questionNo1: questionnaireResponse.answers.get(1),
            questionNo2: questionnaireResponse.answers.get(2),
            questionNo3: questionnaireResponse.answers.get(3),
            questionNo4: questionnaireResponse.answers.get(4),
            questionNo5: questionnaireResponse.answers.get(5),
            questionNo6: questionnaireResponse.answers.get(6),
            risk: questionnaireResponse.riskProfile.level,
            questionnaireId,
            submissionId
        }, { transaction });
    }

    function makeQuestionnaireData(questionnaireModel) {
        if (!questionnaireModel) {
            return null;
        }

        return {
            code: Number.parseInt(questionnaireModel.questionnaireCode),
            designation: questionnaireModel.designation
        };
    }

    function makeSchoolGroupingData(schoolGroupingModel) {
        if (!schoolGroupingModel) {
            return null;
        }

        return {
            code: schoolGroupingModel.schoolGroupingCode,
            name: schoolGroupingModel.name,
            emailContact: schoolGroupingModel.email,
            phoneContact: schoolGroupingModel.phoneNumber
        }
    }
};