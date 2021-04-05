// Factory function
export default function buildMakeQuestion() {

	return makeQuestion

	// Contructor function
	function makeQuestion({
		identifier
	}) {


		if (!identifier) {
			throw Error("Question must have a identifier");
		}


		// Ensure immutability
		return Object.freeze({
			getIdentifier: () => { return identifier },
		});
	}
}