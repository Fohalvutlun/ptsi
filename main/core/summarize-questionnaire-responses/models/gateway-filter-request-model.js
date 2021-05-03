export default function makeFilterGatewayRequestBuilder() {

    const requestData = {
        respondentProfile: { age: null, gender: null },
        schoolGroupingCode: null,
        submissionDate: null
    };

    const builderBehaviour = {
        setRespodentProfile,
        setSchoolGrouping,
        setSubmissionDate,
        makeGatewayRequest
    }
    return Object.freeze(builderBehaviour);

    function setRespodentProfile(age, gender) {
        requestData.respondentProfile = { age, gender };
        return Object.freeze(builderBehaviour);
    }

    function setSchoolGrouping(code) {
        requestData.schoolGroupingCode = code;
        return Object.freeze(builderBehaviour);
    }

    function setSubmissionDate(date) {
        requestData.submissionDate = date;
        return Object.freeze(builderBehaviour);
    }

    function makeGatewayRequest() {
        return Object.freeze(Object.assign({}, requestData));
    }

}