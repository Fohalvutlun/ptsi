import makeFilterGatewayRequestBuilder from './models/gateway-filter-request-model.js';
import makeSummarizeResponseBuilder from './models/summarize-response-model.js';

export default function makeSummarizeQuestionnaireResponses({
    summarizeRequestValidator,
    summarizeQuestionnaireResponsesGateway,
    summarizeQuestionnaireResponsesOutputPort
}) {

    return Object.freeze({ summarize });

    async function summarize(summarizeRequest) {
        if (!summarizeRequestValidator.isValid(summarizeRequest)) {
            const failData = prepareFailData('The summarize request data is invalid');
            return summarizeQuestionnaireResponsesOutputPort.prepareFailView(failData);
        }


        const
            total = await summarizeQuestionnaireResponsesGateway.countQuestionnaireSubmissions(),
            totalByRisk = await summarizeQuestionnaireResponsesGateway.countSubmissionsForEachRiskLevel(),
            totalByGender = await summarizeQuestionnaireResponsesGateway.countSubmissionsForEachGender(),
            totalByAge = await summarizeQuestionnaireResponsesGateway.countSubmissionsForEachAge();

        const
            reactionQuestions = prepareReactionQuestionSet(),
            totalByChoiceByQuestion = await summarizeQuestionnaireResponsesGateway.countAnswerChoiceForEachQuestion(reactionQuestions);

        const filterRequest = prepareGatewayFilterRequest(summarizeRequest.respondentProfile, summarizeRequest.date),
            filteredTotalByRisk = await summarizeQuestionnaireResponsesGateway.countSubmissionsForEachRiskLevel(filterRequest);


        const summarizeResult = prepareSummarizeResult(total, totalByRisk, totalByGender, totalByAge, totalByChoiceByQuestion, filteredTotalByRisk);
        return summarizeQuestionnaireResponsesOutputPort.prepareSuccessView(summarizeResult);
    }

    function prepareFailData(message) {
        return { message };
    }

    function prepareGatewayFilterRequest(respondentProfile, date) {
        return makeFilterGatewayRequestBuilder()
            .setRespodentProfile(respondentProfile.age, respondentProfile.gender)
            .setSchoolGrouping(respondentProfile.schoolGroupingCode)
            .setSubmissionDate(date)
            .makeGatewayRequest();
    }

    function prepareReactionQuestionSet() {
        return [2, 3, 5, 6];
    }

    function prepareSummarizeResult(total, totalByRisk, totalByGender, totalByAge, totalByChoiceByQuestion, filteredTotalByRisk) {
        return makeSummarizeResponseBuilder()
            .setTotalSubmissions(total)
            .setTotalSubmissionsByRiskLevel(totalByRisk)
            .setTotalSubmissionsByGender(totalByGender)
            .setTotalSubmissionsByAge(totalByAge)
            .setTotalResponsesByAnswerChoiceToReactionQuestions(totalByChoiceByQuestion)
            .setTotalFilteredSubmissionsByRiskLevel(filteredTotalByRisk)
            .makeSummarizeResponse();
    }
}