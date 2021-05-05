import makeCountGatewayRequestBuilder from './models/gateway-count-request-model.js';
import makeSummarizeQuestionResponseBuilder from './models/summarize-question-response-model.js';

export default function makeSummarizeQuestion({
    summarizeQuestionOutputPort,
    summarizeQuestionGateway,
    summarizeQuestionRequestValidator
}) {

    return Object.freeze({ summarize });

    async function summarize(summarizeQuestionRequest) {
        if (!summarizeQuestionRequestValidator.isValid(summarizeQuestionRequest)) {
            const failData = prepareFailData('The summarize request data is invalid');
            return summarizeQuestionOutputPort.prepareFailView(failData);
        }

        const
            filter = prepareGatewayFilterRequest(summarizeQuestionRequest),
            totalsByChoiceAndQuestionaire = await summarizeQuestionGateway.countAnswerChoicesForQuestionByQuestionnaire(filter);

        const summarizeResult = prepareSummarizeResult(totalsByChoiceAndQuestionaire, summarizeQuestionRequest.questionCode);
        return summarizeQuestionOutputPort.prepareSuccessView(summarizeResult);
    }

    function prepareFailData(message){
        return {message};
    }

    function prepareGatewayFilterRequest({ respondentProfileFilter, schoolGroupingFilter, submissionFilter, questionCode }) {
        return makeCountGatewayRequestBuilder()
            .setRespodentProfile(respondentProfileFilter.age, respondentProfileFilter.gender)
            .setSchoolGrouping(schoolGroupingFilter.schoolGroupingCode)
            .setSubmissionDate(submissionFilter.maximumDate)
            .setQuestion(questionCode)
            .makeGatewayRequest();
    }

    function prepareSummarizeResult(totals, questionNumber) {
        return prepareSummarizeResultData(totals, questionNumber)
            .makeSummarizeQuestionResponse();
    }

    function prepareSummarizeResultData(totals, questionNumber) {
        const preparedBuilder = makeSummarizeQuestionResponseBuilder().setQuestionNumber(questionNumber);
        return totals.reduce((builder, total) => addTotalToResult(builder, total), preparedBuilder);
    }

    function addTotalToResult(builder, { choiceAnswer, questionnaireCode, count }) {
        return builder.addAnswerChoiceAndQuestionnairePairTotals(choiceAnswer, questionnaireCode, count);
    }

}