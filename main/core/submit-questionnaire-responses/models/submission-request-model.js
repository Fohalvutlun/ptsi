export default function makeSubmissionRequestBuilder() {

    const requestData = {
        respondent: {},
        responses: []
    };


    //Helper
    const responsesMap = new Map();


    const builderBehaviour = {
        setRespondent,
        addAnswer,
        makeSubmissionRequest,
    };
    return Object.freeze(builderBehaviour);

    function setRespondent(age, gender, schoolGroupingCode) {
        requestData.respondent.age = age;
        requestData.respondent.gender = gender;
        requestData.respondent.schoolGroupingCode = schoolGroupingCode;

        return builderBehaviour;
    }

    function addAnswer(questionnaireCode, questionIdentifier, answerChoice) {
        getResponseFromMap(questionnaireCode).get(questionnaireCode).push({ questionIdentifier, answerChoice });
        
        return builderBehaviour;
    }


    function getResponseFromMap(questionnaireCode) {
        return responsesMap.has(questionnaireCode) ? responsesMap : responsesMap.set(questionnaireCode, []);
    }

    function makeSubmissionRequest() {
        requestData.responses = Array.from(responsesMap, ([questionnaireCode, answers]) => {
            return { questionnaireCode, answers }
        });

        const submitQuestionnaireResponseRequest = Object.assign({}, requestData);
        return Object.freeze(submitQuestionnaireResponseRequest);
    }

}