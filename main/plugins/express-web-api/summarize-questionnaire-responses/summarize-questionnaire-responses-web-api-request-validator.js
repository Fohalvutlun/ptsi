export default function makeSummarizeQuestionnaireResponsesWebAPIRequestValidator({
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
            isNullOrUndefined(body.filter)
            || (
                hasValidSchema(body)
                && isValidFilter(body.filter)
            )
        );
    }

    function isValidFilter(filter) {
        return (
            isNullOrUndefined(filter)
            || isDateValid(filter.date)
        );
    }

    function isDateValid(date) {
        return (
            isNullOrUndefined(date)
            || isMonthValid(date.month)
        )
    }

    function isMonthValid(month) {
        return (
            isNullOrUndefined(month)
            || (month >= 1 && month <= 12)
        )
    }

    function isNullOrUndefined(value) {
        return (
            typeof value === 'undefined'
            || value === undefined
            || value === null
        );
    }
}

const webAPIRequestBodyJTDSchema = {
    ref: 'request',
    definitions: {
        request: {
            properties: {
                filter: {
                    ref: 'filter',
                    nullable: true
                }
            }
        },
        filter: {
            properties: {
                groupingCode: { type: 'string', nullable: true },
                age: { type: 'uint8', nullable: true },
                gender: { type: 'string', nullable: true },
                date: { ref: 'date' }
            }
        },
        date: {
            properties: {
                month: { type: 'uint8', nullable: true },
                year: { type: 'uint16', nullable: true }
            },
            nullable: true
        }
    }
};