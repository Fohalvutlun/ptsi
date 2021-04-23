import { toDecimalConverter } from '../../../utilities/roman-numerals-converter.js';

export default function makeSubmitQuestionnaireAnswersWebAPIRequestValidator({
    jtdSchemaValidator
}) {

    const { hasValidSchema } = jtdSchemaValidator.instantiateSchema(webAPIRequestBodyJTDSchema);


    return Object.freeze({
        isValid
    });

    function isValid(webAPIRequest) {
        return isWebAPIRequestBodyValid(webAPIRequest.body);
    }

    function isWebAPIRequestBodyValid(body) {
        return (
            hasValidSchema(body)
            && areQuestionnaireResponsesValid(body.questionnaireResponses)
        );
    }

    function areQuestionnaireResponsesValid(questionnaireResponses) {
        return questionnaireResponses.every((questionnaireResponse) => isQuestionnaireResponseValid(questionnaireResponse));
    }

    function isQuestionnaireResponseValid(questionnaireResponse) {
        return isResponseValid(questionnaireResponse.response)
    }

    function isResponseValid(response) {
        return (
            answerEndsWithRomanNumeral(response.question1)
            && answerEndsWithRomanNumeral(response.question2)
        );
    }

    function answerEndsWithRomanNumeral(answer) {
        return toDecimalConverter(answer.split('.').pop()).isValid();
    }
}

const webAPIRequestBodyJTDSchema = {
    ref: "request",
    definitions: {
        request: {
            properties: {
                respondent: { ref: 'respondent' },
                questionnaireResponses: { ref: 'questionnaireResponses' }
            }
        },
        respondent: {
            properties: {
                age: { type: 'uint8' },
                gender: { type: 'string' },
                groupingCode: { type: 'string' }
            }
        },
        questionnaireResponses: {
            elements: {
                ref: 'questionnaireResponse'
            }
        },
        questionnaireResponse: {
            properties: {
                questionnaireCode: { type: 'uint8' },
                response: {
                    properties: {
                        question1: { type: 'string' },
                        question1_1: { type: 'string', nullable: true },
                        question1_2: { type: 'string', nullable: true },
                        question2: { type: 'string' },
                        question2_1: { type: 'string', nullable: true },
                        question2_2: { type: 'string', nullable: true }
                    }
                }

            }
        }
    }
};