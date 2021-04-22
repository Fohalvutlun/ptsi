export default function makeSubmissionRequestValidator({
    submissionRequestModelValidatorGateway,
    jtdSchemaValidator
}) {

    const { hasValidSchema } = jtdSchemaValidator.instantiateSchema(submissionRequestModelJTDSchema);

    return Object.freeze({
        isValid
    });

    function isValid(submissionRequest) {
        return (
            hasValidSchema(submissionRequest)
            && areResponsesValid(submissionRequest.responses)
            && isRespondentValid(submissionRequest.respondent)

        );
    }

    function areResponsesValid(responses) {
        return (
            responses.length === 2
            && responses.every((response) => isResponseValid(response))
        );
    }

    function isResponseValid(response) {
        return (
            areAnswersValid(response.answers)
            && isQuestionnaireCodeValid(response.questionnaireCode)
        );
    }

    function areAnswersValid(answers) {
        return answers.length >= 2;
    }

    function isQuestionnaireCodeValid(questionnaireCode) {
        const questionnareCodeExists =
            submissionRequestModelValidatorGateway.isThereOneQuestionnaireWithCodeEqualTo(questionnaireCode);
        return questionnareCodeExists;
    }

    function isRespondentValid(respondent) {
        return (
            isAgeValid(respondent.age)
            && isSchoolGroupingCodeValid(respondent.schoolGroupingCode)
        );
    }

    function isAgeValid(age) {
        return age >= 6 && age <= 12;
    }

    function isSchoolGroupingCodeValid(schoolGroupingCode) {
        const schoolGroupingCodeExists =
            submissionRequestModelValidatorGateway.isThereOneSchoolGroupingWithCodeEqualTo(schoolGroupingCode);
        return schoolGroupingCodeExists;
    }
}

const submissionRequestModelJTDSchema = {
    ref: "submissionRequest",
    definitions: {
        submissionRequest: {
            properties: {
                respondent: { ref: 'respondent' },
                responses: { ref: 'responses' }
            }
        },
        respondent: {
            properties: {
                age: { type: 'uint8' },
                gender: { enum: ["f", "m"] },
                schoolGroupingCode: { type: 'string' }
            }
        },
        responses: {
            elements: {
                ref: 'response'
            }
        },
        response: {
            properties: {
                questionnaireCode: { type: 'uint32' },
                answers: { ref: 'answers' }
            }
        },
        answers: {
            elements: {
                ref: 'answer'
            }
        },
        answer: {
            properties: {
                questionIdentifier: { type: 'uint8' },
                answerChoice: { type: 'uint8' }
            }
        }
    }
};