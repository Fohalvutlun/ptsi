// Factory function
export default function buildMakeAnswer() {

	// Contructor function
	return function makeAnswer({
		choice,
		question
	}) {


		if (!choice) {
			throw Error("Answer must have not be empty");
		}

		if (!question) {
			throw Error("Answer must have an associated question");
		}


		// Ensure immutability
		return Object.freeze({
			getChoice: () => { return choice },
			getQuestion: () => { return question }
		});
	}
}

