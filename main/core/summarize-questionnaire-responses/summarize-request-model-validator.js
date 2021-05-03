export default function makeSummarizeRequestValidator({
    summarizeRequestModelValidatorGateway,
    jtdSchemaValidator
}) {

    const { hasValidSchema } = jtdSchemaValidator.instantiateSchema(summarizeRequestModelJTDSchema);

    return Object.freeze({ isValid });

    function isValid(summarizeRequest) {
        return (
            hasValidSchema(summarizeRequest)
            && isRespondentProfileValid(summarizeRequest.respondentProfile)
            && isDateValid(summarizeRequest.filter.date)
        );
    }

    function isRespondentProfileValid(respodent) {
        return (
            isSchoolGroupingCodeValid(respodent.schoolGroupingCode)
            && isAgeValid(respodent.age)
        )
    }

    function isSchoolGroupingCodeValid(schoolGroupingCode) {
        return (
            schoolGroupingCode === null
            || summarizeRequestModelValidatorGateway.isThereOneSchoolGroupingWithCodeEqualTo(schoolGroupingCode)
        );
    }

    function isAgeValid(age) {
        return (
            age === null
            || (age >= 6 && age <= 12)
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

const summarizeRequestModelJTDSchema = {
    ref: "summarizeRequest",
    definitions: {
        summarizeRequest: {
            properties: {
                respondentProfile: { ref: 'respondentProfile' },
                date: { ref: 'date' }
            }
        },
        respondentProfile: {
            properties: {
                age: { type: 'uint8', nullable: true },
                gender: { enum: ["f", "m"], nullable: true },
                schoolGroupingCode: { type: 'string', nullable: true }
            }
        },
        date: { nullable: true }
    }
};