import { toDecimalConverter } from '../../../utilities/roman-numerals-converter.js';
import makeSubmissionRequestBuilder from '../../../core/submit-questionnaire-responses/models/submission-request-model.js';

export default function makeSubmitQuestionnaireAnswersWebAPIController({
    submitQuestionnaireResponsesInputPort,
    submitQuestionnaireAnswersWebAPIRequestValidator,
    inputErrorPresenter
}) {
    const submitQuestionnaireAnswersWebAPIControllerBehaviour = {
        execute
    };

    return Object.freeze(submitQuestionnaireAnswersWebAPIControllerBehaviour);

    async function execute(webAPIRequest) {

        if (!submitQuestionnaireAnswersWebAPIRequestValidator.isValid(webAPIRequest)) {
            return inputErrorPresenter.prepareFailView({ message: 'The web request\'s format or structure is invalid.' });
        }

        const submissionRequest = prepareSubmissionRequest(webAPIRequest.body);
        return await submitQuestionnaireResponsesInputPort.submit(submissionRequest);
    }

    function prepareSubmissionRequest(body) {
        const builder = makeSubmissionRequestBuilder()
            .setRespondent(body.respondent.age, body.respondent.gender.toLowerCase(), body.respondent.groupingCode);
        for (let questionnaireResponse of body.questionnaireResponses) {
            const response = questionnaireResponse.response;

            builder
                .addAnswer(questionnaireResponse.questionnaireCode, 1, attemptAnswerToInteger(response.question1))
                .addAnswer(questionnaireResponse.questionnaireCode, 2, attemptAnswerToInteger(response.question1_1))
                .addAnswer(questionnaireResponse.questionnaireCode, 3, attemptAnswerToInteger(response.question1_2))
                .addAnswer(questionnaireResponse.questionnaireCode, 4, attemptAnswerToInteger(response.question2))
                .addAnswer(questionnaireResponse.questionnaireCode, 5, attemptAnswerToInteger(response.question2_1))
                .addAnswer(questionnaireResponse.questionnaireCode, 6, attemptAnswerToInteger(response.question2_2))
        }

        return builder.makeSubmissionRequest();
    }

    function attemptAnswerToInteger(answer) {
        return answer != null ? answerToInteger(answer) : answer;
    }

    function answerToInteger(answer) {
        return toDecimalConverter(answer.split('.').pop()).getDecimal();
    }
}