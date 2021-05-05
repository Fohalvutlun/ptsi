export default function makeSummarizeQuestionRequestBuilder() {

    const requestData = {
        respondentProfileFilter: {},
        schoolGroupingFilter: {},
        submissionFilter: {},
        questionCode: null
    };

    const builderBehaviour = {
        setRespondentProfileFilter,
        setSchoolGroupingFilter,
        setDateFilter,
        setQuestion,
        makeSummarizeQuestionRequest
    };

    return Object.freeze(builderBehaviour);

    function setRespondentProfileFilter(age, gender) {
        requestData.respondentProfileFilter = { age, gender };
        return Object.freeze(builderBehaviour);
    }

    function setSchoolGroupingFilter(schoolGroupingCode) {
        requestData.schoolGroupingFilter = { schoolGroupingCode };
        return Object.freeze(builderBehaviour);
    }

    function setDateFilter(maximumDate) {
        requestData.submissionFilter = { maximumDate };
        return Object.freeze(builderBehaviour);
    }

    function setQuestion(question) {
        requestData.questionCode = question;
        return Object.freeze(builderBehaviour);
    }

    function makeSummarizeQuestionRequest() {
        return Object.assign({}, requestData)
    }
}