// Factory function (Dependency Injection)
export default function buildMakeRespondent() {

	// Contructor function
	return function makeRespondent({
		age,
		gender,
		schoolGrouping
	}) {


		if (!age) {
			throw Error("Respondent must have an age");
		}

		if (age < 6 || age > 12) {
			throw RangeError("Respondent age must be a number between 6 and 12");
		}

		if (!gender) {
			throw Error("Respondent must have a gender");
		}

		if (gender.length > 1) {
			throw Error("Respondent gender must be represented by single character");
		}

		if (!schoolGrouping) {
			throw Error("Respondent must have a schoolGrouping");
		}


		// Ensure immutability
		return Object.freeze({
			getAge: () => { return age },
			getGender: () => { return gender },
			getSchoolGrouping: () => { return schoolGrouping }
		});
	}
}

