import AJV from "ajv/dist/jtd.js";

export default function buildMakeJTDSchemaValidator(){
    
    const ajv = new AJV();
    
    return makeJTDSchemaValidator;
    
    function makeJTDSchemaValidator(schema){

        const validateJTD = ajv.compile(schema);
    
        return Object.freeze({
            isValidSchema
        });
    
        function isValidSchema(object){
            return validateJTD(object);
        }
    }
}