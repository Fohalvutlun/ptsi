import makeSummarizeQuestionRequestBuilder from './../../../core/summarize-question/models/summarize-question-request-model.js';

export default function makeSummarizeQuestionWebAPIController({
    summarizeQuestionInputPort,
    summarizeQuestionWebAPIRequestValidator,
    inputErrorPresenter
}) {
    const summarizeQuestionWebAPIControllerBehaviour = {
        execute
    };

    return Object.freeze(summarizeQuestionWebAPIControllerBehaviour);

    async function execute(webAPIRequest) {

        if (!summarizeQuestionWebAPIRequestValidator.isValid(webAPIRequest)) {
            return inputErrorPresenter.prepareFailView({ message: 'The web request\'s format or structure is invalid.' });
        }

        const summarizeRequest = prepareSummarizeQuestionRequest(webAPIRequest.body, webAPIRequest.query);
        return await summarizeQuestionInputPort.summarize(summarizeRequest);
    }

    function prepareSummarizeQuestionRequest(body, query) {
        const emptyFilter = makeEmptyFilter();
        const filter = Object.assign(emptyFilter, body.filter);

        // Use case supports filtering by age but web api doesn't
        return makeSummarizeQuestionRequestBuilder()
            .setQuestion(Number.parseInt(query.question))
            .setDateFilter(makeDateFilter(filter.date))
            .setRespondentProfileFilter(null, formatGender(filter.gender))
            .setSchoolGroupingFilter(filter.groupingCode)
            .makeSummarizeQuestionRequest();
    }

    function formatGender(gender) {
        return gender ? gender.toLowerCase() : gender;
    }

    function makeEmptyFilter() {
        return {
            groupingCode: null,
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