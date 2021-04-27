export default function makeGatewayRequestBuilder() {

    const requestData = {};


    // Helper Data Structure
    const responsesMap = new Map();


    const builderBehaviour = {
        setRespondent,
        setMomentOfSubmission,
        setSubmissionRiskProfile,
        setQuestionnaireResponses,
        makeGatewayRequest
    };
    return Object.freeze(builderBehaviour);


    function setRespondent(age, gender, schoolGroupingEntity) {
        const schoolGroupingData = getSchoolGroupingData(schoolGroupingEntity);

        requestData.respondent = {
            age,
            gender,
            schoolGrouping: schoolGroupingData,
        }

        return Object.freeze(builderBehaviour);
    }

    function setMomentOfSubmission(momentOfSubmission) {
        requestData.momentOfSubmission = momentOfSubmission;
        return Object.freeze(builderBehaviour);
    }

    function setSubmissionRiskProfile(level,designation) {
        requestData.submissionRiskProfile = {level,designation};
        return Object.freeze(builderBehaviour);
    }

    function setQuestionnaireResponses(questionnaireResponsesMap) {
        requestData.questionnaireResponses = Array.from(questionnaireResponsesMap.values(), (questionnaireResponseEntity) => {
            return getQuestionnaireResponseData(questionnaireResponseEntity);
        });
        return Object.freeze(builderBehaviour);
    }

    function makeGatewayRequest() {
        return Object.assign({}, requestData);
    }

    function getQuestionnaireResponseData(questionnaireResponseEntity) {

        const answers = getMapOfAnswers(questionnaireResponseEntity.getAnswers());

        return {
            questionnaire: {
                code: questionnaireResponseEntity.getQuestionnaire().getCode(),
                designation: questionnaireResponseEntity.getQuestionnaire().getDesignation()
            },
            answers,
            riskProfile: {
                level: questionnaireResponseEntity.getRiskProfile().getLevel(),
                designation: questionnaireResponseEntity.getRiskProfile().getDesignation()
            }
        };
    }

    function getSchoolGroupingData(schoolGroupingEntity) {
        return {
            code: schoolGroupingEntity.getCode(),
            name: schoolGroupingEntity.getName(),
            phoneContact: schoolGroupingEntity.getEmailContact(),
            emailContact: schoolGroupingEntity.getPhoneContact()
        }
    }

    function getMapOfAnswers(answersMap) {
        const newAnswersMap = new Map();
        answersMap.forEach((answer, questionIdentifer) => {
            newAnswersMap.set(questionIdentifer, answer.getChoice());
        });

        return newAnswersMap;
    }
}