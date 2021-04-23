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
            && isRespondentValid(submissionRequest.respondent)
            && areResponsesValid(submissionRequest.responses)
        );
    }

    function areResponsesValid(responses) {
        return (
            responses.length === 2
            && responses.every(response => isResponseValid(response))
        );
    }

    function isResponseValid(response) {
        return (
            isQuestionnaireCodeValid(response.questionnaireCode)
            && areAnswersValid(response.answers)
        );
    }

    function areAnswersValid(answers) {
        return (
            numberOfAnswersIsValid(answers)
            && answers.every(answer => isAnswerValid(answer))
            && isAnswerSequenceValid(answers)
        );
    }

    function numberOfAnswersIsValid(answers) {
        const numOfAnswersMade = answers.reduce((counter, answer) => answer.answerChoice !== null ? counter + 1 : counter, 0);
        return (
            numOfAnswersMade >= 2
            && numOfAnswersMade <= 4
        );
    }

    function isAnswerSequenceValid(answers) {
        return (
            atMaxOneBranchWasTaken(answers, [2, 3])
            && atMaxOneBranchWasTaken(answers, [5, 6])
        );
    }

    function atMaxOneBranchWasTaken(answers, branchQuestionIdentifiers = []) {
        return branchQuestionIdentifiers.some(code => {
            const res = answers.findIndex(answer => answer.questionIdentifier === code && answer.answerChoice !== null) === -1
            return res;
        });
    }

    function isAnswerValid(answer) {
        return (
            isMandatoryAnswer(answer)
            || isOptionalAnswer(answer)
        );
    }

    function isMandatoryAnswer(answer) {
        return (
            mandatoryQuestionIDs.includes(answer.questionIdentifier)
            && answer.answerChoice !== null
        );
    }

    function isOptionalAnswer(answer) {
        return optionalQuestionIDs.includes(answer.questionIdentifier);
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

const mandatoryQuestionIDs = [1, 4];
const optionalQuestionIDs = [2, 3, 5, 6];

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
                answerChoice: { type: 'uint8', nullable: true }
            }
        }
    }
};