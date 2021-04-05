// Factory function
export default function buildMakeQuestionnaireResponse({
	makeRiskProfile
}) {

	// Contructor function
	return function makeQuestionnaireResponse({
		questionnaire,
		answers,
		riskProfile
	}) {


		if (!questionnaire) {
			throw Error("QuestionnaireResponse must have a questionnaire");
		}

		if (!answers || answers.size < 2) {
			throw Error("QuestionnaireResponse must have at least 2 answers");
		}


		// Ensure immutability
		return Object.freeze({
			getQuestionnaire: () => questionnaire,
			getAnswers: () => answers,
			getRiskProfile: () => { return riskProfile ? riskProfile : evaluateRiskProfile() },
			evaluateRiskProfile
		});

		function evaluateRiskProfile(){
			let level;
			
			// Needs refactoring
			if (answers.get(1).getChoice() == 3) {
				if (answers.get(4).getChoice() == 3) {
					level = 3;
				} else {
					level = 2;
				}
			} else {
				level = 1;
			}

			riskProfile = makeRiskProfile({level});
			return riskProfile;
		}
	}
}

