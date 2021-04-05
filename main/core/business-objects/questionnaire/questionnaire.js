// Factory function
export default function buildMakeQuestionnaire(){
	
	// Contructor function
	return function makeQuestionnaire({
		code,
		designation
	}){

		if(!code){
			throw Error("Questionnaire must have a designated code");
		}

		if(!designation){
			throw Error("Questionnaire must have a designation");
		}
		
		
		// Ensure immutability
		return Object.freeze({
			getCode: () => {return code},
			getDesignation: () => {return designation}
		});
	}
}

