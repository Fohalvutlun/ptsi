import makeSummarizeRequestBuilder from '../../../core/summarize-questionnaire-responses/models/summarize-request-model.js';

export default function makeSummarizeQuestionnaireResponsesWebAPIController({
    summarizeQuestionnaireResponsesInputPort,
    summarizeQuestionnaireResponsesWebAPIRequestValidator,
    inputErrorPresenter
}) {

    const summarizeQuestionnaireResponsesWebAPIControllerBehaviour = {
        execute
    };

    return Object.freeze(summarizeQuestionnaireResponsesWebAPIControllerBehaviour);

    async function execute(webAPIRequest) {

        if (!summarizeQuestionnaireResponsesWebAPIRequestValidator.isValid(webAPIRequest)) {
            return inputErrorPresenter.prepareFailView({ message: 'The web request\'s format or structure is invalid.' });
        }

        const summarizeRequest = prepareSummarizeRequest(webAPIRequest.body);
        return await summarizeQuestionnaireResponsesInputPort.summarize(summarizeRequest);
    }

    function prepareSummarizeRequest(body) {
        const emptyFilter = makeEmptyFilter();
        const filter = Object.assign(emptyFilter, body.filter);

        return makeSummarizeRequestBuilder()
            .setDate(makeDateFilter(filter.date))
            .setRespondent(filter.age, formatGender(filter.gender), filter.groupingCode)
            .makeSummarizeRequest();
    }

    function formatGender(gender) {
        return gender ? gender.toLowerCase() : gender;
    }

    function makeEmptyFilter() {
        return {
            groupingCode: null,
            age: null,
            gender: null,
            date: null
        };
    }

    function makeDateFilter(providedDate) {
        if (providedDate && Number.isInteger(providedDate.year) && Number.isInteger(providedDate.month)) {
            const date = new Date(0);
            date.setFullYear(providedDate.year);
            date.setMonth(providedDate.month - 1);

            return date;
        }
        return null;
    }
}
