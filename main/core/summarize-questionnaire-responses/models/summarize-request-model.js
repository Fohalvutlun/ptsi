export default function makeSummarizeRequestBuilder() {

    const requestData = {
        respodentProfile: {}
    };

    const builderBehaviour = {
        setRespondent,
        setDate,
        makeSummarizeRequest,
    };
    return Object.freeze(builderBehaviour);

    function setRespondent(age, gender, schoolGroupingCode) {
        requestData.respondent.age = age;
        requestData.respondent.gender = gender;
        requestData.respondent.schoolGroupingCode = schoolGroupingCode;

        return Object.freeze(builderBehaviour);;
    }

    function setDate(date) {
        requestData.date = date;
        return Object.freeze(builderBehaviour);;
    }

    function makeSummarizeRequest() {
        return Object.freeze(Object.assign({}, requestData));
    }

}