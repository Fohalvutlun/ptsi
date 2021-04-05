export default function makeSubmissionResponseBuilder() {

    const responseData = {}

    const builderBehaviour = {
        setRiskProfile,
        setSchoolGrouping,
        makeSubmissionResponse
    };
    return Object.freeze(builderBehaviour);


    function setRiskProfile(level, designation) {
        responseData.riskProfile = {
            level,
            designation
        };
        return builderBehaviour;
    }

    function setSchoolGrouping(name, phoneContact, emailContact) {
        responseData.schoolGrouping = {
            name,
            phoneContact,
            emailContact
        };
        return builderBehaviour;
    }

    function makeSubmissionResponse() {
        return Object.assign({}, responseData);
    }
}