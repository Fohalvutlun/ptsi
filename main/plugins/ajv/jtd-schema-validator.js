import AJV from "ajv/dist/jtd.js";

export default function makeJTDSchemaValidator() {

    const ajv = new AJV();

    return Object.freeze({
        instantiateSchema
    });

    function instantiateSchema(schema) {

        const validateJTD = ajv.compile(schema);

        return Object.freeze({
            hasValidSchema
        });

        function hasValidSchema(object) {
            return validateJTD(object);
        }
    }
}