// Factory function
export default function buildMakeSchoolGrouping(){
	
	// Contructor function
	return function makeSchoolGrouping({
		code,
		name,
		emailContact,
		phoneContact
	}){

		if(!code){
			throw Error("SchoolGrouping must have a designated code");
		}

		if(!name){
			throw Error("SchoolGrouping must have an name");
		}

		if(!emailContact){
			throw Error("SchoolGrouping must have an email contact");
		}

		if(!phoneContact){
			throw Error("SchoolGrouping must have a phone number contact");
		}

		
		// Ensure immutability
		return Object.freeze({
			getCode: () => {return code},
			getName: () => {return name},
			getEmailContact: () => {return emailContact},
			getPhoneContact: () => {return phoneContact}
		});
	}	
}

