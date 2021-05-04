export default function makeSummarizeRequestBuilder() {

    const requestData = {
        respondentProfile: {}
    };

    const builderBehaviour = {
        setRespondent,
        setDate,
        makeSummarizeRequest,
    };
    return Object.freeze(builderBehaviour);

    function setRespondent(age, gender, schoolGroupingCode) {
        requestData.respondentProfile = {
            age: age,
            gender: gender,
            schoolGroupingCode: schoolGroupingCode
        };

        return Object.freeze(builderBehaviour);
    }

    function setDate(date) {
        requestData.date = date;
        return Object.freeze(builderBehaviour);
    }

    function makeSummarizeRequest() {
        return Object.freeze(Object.assign({}, requestData));
    }

}