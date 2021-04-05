// Factory function
export default function buildMakeQuestionnaireSubmission({
    makeRiskProfile
}) {

    // Contructor function
    return function makeQuestionnaireSubmission({
        momentOfSubmission,
        respondent,
        questionnaireResponses,
        riskProfile
    }) {


        if (!momentOfSubmission) {
            throw Error("QuestionnaireSubmission must have a momentOfSubmission");
        }

        if (momentOfSubmission && momentOfSubmission.getTime() > Date.now()) {
            throw Error("QuestionnaireSubmission must have a momentOfSubmission that happened in the past");
        }

        if (!respondent) {
            throw Error("QuestionnaireSubmission must have a respondent");
        }

        if (!questionnaireResponses || questionnaireResponses.size != 2) {
            throw Error("QuestionnaireSubmission must contain 2 questionnaireResponses");
        }

        // Ensure immutability
        return Object.freeze({
            getMomentOfSubmission: () => momentOfSubmission,
            getRespondent: () => respondent,
            getRiskProfile: () => { return riskProfile ? riskProfile : evaluateRiskProfile() },
            getQuestionnaireResponses: () => questionnaireResponses,
            evaluateRiskProfile
        });

        function evaluateRiskProfile(){
            const responseRiskLevels = [];
            questionnaireResponses.forEach((response) => {
                const profile = response.getRiskProfile();
                responseRiskLevels.push(profile.getLevel());
            });
            const level = Math.max(...responseRiskLevels);
            
            riskProfile = makeRiskProfile({level});
            return riskProfile;
        }
    }

    
}

