export default function makeGatewayRequestBuilder() {

    const requestData = {};


    // Helper Data Structure
    const responsesMap = new Map();


    const builderBehaviour = {
        setRespondent,
        setMomentOfSubmission,
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

        return builderBehaviour;
    }

    function setMomentOfSubmission(momentOfSubmission) {
        requestData.momentOfSubmission = momentOfSubmission;
        return builderBehaviour;
    }

    function setQuestionnaireResponses(questionnaireResponsesMap) {
        requestData.questionnaireResponses = Array.from(questionnaireResponsesMap.values(), (questionnaireResponseEntity) => {
            return getQuestionnaireResponseData(questionnaireResponseEntity);
        });
        return builderBehaviour;
    }

    function getQuestionnaireResponseData(questionnaireResponseEntity) {

        const answers = getListOfDataOfAnswers(questionnaireResponseEntity.getAnswers());

        return {
            questionnaire: {
                code: questionnaireResponseEntity.getQuestionnaire().getCode(),
                designation: questionnaireResponseEntity.getQuestionnaire().getDesignation()
            },
            answers
        };
    }

    function makeGatewayRequest() {
        return Object.assign({}, requestData);
    }


    function getSchoolGroupingData(schoolGroupingEntity) {
        return {
            code: schoolGroupingEntity.getCode(),
            name: schoolGroupingEntity.getName(),
            phoneContact: schoolGroupingEntity.getEmailContact(),
            emailContact: schoolGroupingEntity.getPhoneContact()
        }
    }

    function getListOfDataOfAnswers(answersMap) {
        return Array.from(answersMap.values(), (answerEntity) => {
            return {
                choice: answerEntity.getChoice(),
                question: {
                    identifier: answerEntity.getQuestion().getIdentifier()
                }
            };
        });
    }
}