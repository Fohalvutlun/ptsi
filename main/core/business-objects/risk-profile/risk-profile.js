// Factory function
export default function buildMakeRiskProfile(){
	
	const designations = new Map();

	designations.set(1,"Verde");
	designations.set(2,"Amarelo");
	designations.set(3,"Vermelho");


	// Contructor function
	return function makeRiskProfile({
		level
	}){


		if(!level){
			throw Error("RiskProfile must a defined level");
		}

		// Ensure immutability
		return Object.freeze({
			getLevel: () => {return level},
			getDesignation: () => {return designations.get(level);}
		});
	}
}

