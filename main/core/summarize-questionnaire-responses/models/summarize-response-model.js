export default function makeSummarizeResponseBuilder() {

    const responseData = {
        totalSubmissions: null,
        totalSubmissionsByRiskLevel: null,
        totalSubmissionsByGender: null,
        totalSubmissionsByAge: null,
        totalResponsesByChoiceToReactionQuestions: null,
        totalFilteredSubmissionsByRiskLevel: null
    }

    const builderBehaviour = {
        setTotalSubmissions,
        setTotalSubmissionsByRiskLevel,
        setTotalSubmissionsByGender,
        setTotalSubmissionsByAge,
        setTotalResponsesByAnswerChoiceToReactionQuestions,
        setTotalFilteredSubmissionsByRiskLevel,
        makeSummarizeResponse
    };
    return Object.freeze(builderBehaviour);

    function setTotalSubmissions(total) {
        responseData.totalSubmissions = total;
        return Object.freeze(builderBehaviour);
    }

    function setTotalSubmissionsByRiskLevel(riskLevelTotalsMap) {
        responseData.totalSubmissionsByRiskLevel = riskLevelTotalsMap;
        return Object.freeze(builderBehaviour);
    }

    function setTotalSubmissionsByGender(genderTotalsMap) {
        responseData.totalSubmissionsByGender = genderTotalsMap;
        return Object.freeze(builderBehaviour);
    }

    function setTotalSubmissionsByAge(ageTotalsMap) {
        responseData.totalSubmissionsByAge = ageTotalsMap;
        return Object.freeze(builderBehaviour);
    }

    function setTotalResponsesByAnswerChoiceToReactionQuestions(questionChoiceResponseTotalsMap) {
        responseData.totalResponsesByChoiceToReactionQuestions = questionChoiceResponseTotalsMap;
        return Object.freeze(builderBehaviour);
    }

    function setTotalFilteredSubmissionsByRiskLevel(filteredRiskLevelTotalsMap) {
        responseData.totalFilteredSubmissionsByRiskLevel = filteredRiskLevelTotalsMap;
        return Object.freeze(builderBehaviour);
    }

    function makeSummarizeResponse() {
        return Object.freeze(Object.assign({}, responseData));
    }
}
