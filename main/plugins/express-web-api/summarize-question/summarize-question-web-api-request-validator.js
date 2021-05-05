export default function makeSummarizeQuestionWebAPIRequestValidator({
    jtdSchemaValidator
}) {

    const hasValidBodySchema = instantiateSchema(webAPIRequestBodyJTDSchema);
    const hasValidQuerySchema = instantiateSchema(webAPIRequestQueryJTDSchema);

    return Object.freeze({
        isValid
    });

    function isValid(webAPIRequest) {
        return (
            isWebAPIRequestQueryValid(webAPIRequest.query)
            && isWebAPIRequestBodyValid(webAPIRequest.body)
        );
    }

    function isWebAPIRequestQueryValid(query) {
        return (
            hasValidQuerySchema(query)
            && isValidQuestion(query.question)
        );
    }

    function isWebAPIRequestBodyValid(body) {
        return (
            isNullOrUndefined(body.filter)
            || (
                hasValidBodySchema(body)
                && isValidFilter(body.filter)
            )
        );
    }

    function isValidQuestion(question) {
        return isParseableInteger(question);
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

    function isParseableInteger(number) {
        return tryOrFail(() => Number.isInteger(Number.parseInt(number)), (_) => false)
    }

    // Helpers
    function instantiateSchema(schema) {
        const { hasValidSchema } = jtdSchemaValidator.instantiateSchema(schema);
        return hasValidSchema;
    }

    function tryOrFail(tryFn, failFn) {
        try {
            return tryFn();
        } catch (err) {
            if(!failFn)
                throw err;
            return failFn(err);
        }
    }
}

const webAPIRequestBodyJTDSchema = {
    ref: 'body',
    definitions: {
        body: {
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

const webAPIRequestQueryJTDSchema = {
    ref: 'query',
    definitions: {
        query: {
            properties: {
                question: { type: 'string' }
            }
        }
    }
};