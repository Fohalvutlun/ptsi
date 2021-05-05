export default function makeSummarizeQuestionRequestValidator({
    summarizeQuestionRequestModelValidatorGateway,
    jtdSchemaValidator
}) {

    const { hasValidSchema } = jtdSchemaValidator.instantiateSchema(summarizeQuestionRequestModelJTDSchema);

    return Object.freeze({
        isValid
    });

    function isValid(summarizeQuestionRequest) {
        return (
            hasValidSchema(summarizeQuestionRequest)
            && isRespondentProfileFilterValid(summarizeQuestionRequest.respondentProfileFilter)
            && isSchoolGroupingFilterValid(summarizeQuestionRequest.schoolGroupingFilter)
            && isSubmissionFiterValid(summarizeQuestionRequest.submissionFilter)
        );
    }

    function isRespondentProfileFilterValid(respondentProfileFilter) {
        return isAgeValid(respondentProfileFilter.age);
    }

    function isSchoolGroupingFilterValid(schoolGroupingFilter) {
        return isSchoolGroupingCodeValid(schoolGroupingFilter.schoolGroupingCode)
    }

    function isSubmissionFiterValid(submissionFilter) {
        return isDateValid(submissionFilter.maximumDate);
    }

    function isAgeValid(age) {
        return (
            age === null
            || (age >= 6 && age <= 12)
        );
    }

    function isSchoolGroupingCodeValid(schoolGroupingCode) {
        return (
            schoolGroupingCode === null
            || summarizeQuestionRequestModelValidatorGateway.isThereOneSchoolGroupingWithCodeEqualTo(schoolGroupingCode)
        );
    }

    function isDateValid(date) {
        return (
            date === null
            || (
                date instanceof Date
                && isNotInTheFuture(date)
            )
        );
    }

    function isNotInTheFuture(date) {
        return date.getTime() <= Date.now()
    }
}

const summarizeQuestionRequestModelJTDSchema = {
    ref: "summarizeQuestionRequest",
    definitions: {
        summarizeQuestionRequest: {
            properties: {
                respondentProfileFilter: { ref: 'respondentProfileFilter' },
                schoolGroupingFilter: { ref: 'schoolGroupingFilter' },
                submissionFilter: { ref: 'submissionFilter' },
                questionCode: { type: 'uint16' }
            }
        },
        respondentProfileFilter: {
            properties: {
                age: { type: 'uint8', nullable: true },
                gender: { enum: ["f", "m"], nullable: true },
            }
        },
        schoolGroupingFilter: {
            properties: {
                schoolGroupingCode: { type: 'string', nullable: true }
            }
        },
        submissionFilter: {
            properties: {
                maximumDate: { nullable: true }
            }
        }
    }
};