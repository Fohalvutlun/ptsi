import { toDecimalConverter } from '../../../utilities/roman-numerals-converter.js';
import makeSubmissionRequestBuilder from '../../../core/submit-questionnaire-responses/models/submission-request-model.js';

export default function makeSubmitQuestionnaireAnswersWebAPIController({
    submitQuestionnaireRespondeInputPort,
    submitQuestionnaireAnswersWebAPIRequestValidator,
    inputErrorPresenter
}) {
    const submitQuestionnaireAnswersWebAPIControllerBehaviour = {
        execute
    };

    return Object.freeze(submitQuestionnaireAnswersWebAPIControllerBehaviour);

    async function execute(webAPIRequest) {

        if (!submitQuestionnaireAnswersWebAPIRequestValidator.isValid(webAPIRequest)) {
            return inputErrorPresenter.prepareFailView({message:'The web request\'s format or structure is invalid.'});
        }

        const submissionRequest = prepareSubmissionRequest(webAPIRequest.body);
        return await submitQuestionnaireRespondeInputPort.submit(submissionRequest);
    }

    function prepareSubmissionRequest(body) {
        const builder = makeSubmissionRequestBuilder()
            .setRespondent(body.respondent.age, body.respondent.gender.toLowerCase(), body.respondent.groupingCode);
        for (let questionnaireResponse of body.questionnaireResponses) {
            const response = questionnaireResponse.response;

            builder
                .addAnswer(questionnaireResponse.questionnaireCode, 1, answerToInteger(response.question1))
                .addAnswer(questionnaireResponse.questionnaireCode, 2, answerToInteger(response.question1_1))
                .addAnswer(questionnaireResponse.questionnaireCode, 3, answerToInteger(response.question1_2))
                .addAnswer(questionnaireResponse.questionnaireCode, 4, answerToInteger(response.question2))
                .addAnswer(questionnaireResponse.questionnaireCode, 5, answerToInteger(response.question2_1))
                .addAnswer(questionnaireResponse.questionnaireCode, 6, answerToInteger(response.question2_2))
        }

        return builder.makeSubmissionRequest();
    }

    function answerToInteger(answer) {
        const answerNum = toDecimalConverter(answer.split('.').pop()).getDecimal();
        return answerNum === 0 ? null : answerNum;
    }
}

function prepareFailView(message) {
    return {
        statusCode: 400,
        body: {
            error: { errorMessage: message }
        }
    };
}