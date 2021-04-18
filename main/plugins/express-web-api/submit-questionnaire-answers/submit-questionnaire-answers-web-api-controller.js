import { toDecimal } from '../../../utilities/roman-numerals.js';
import makeSubmissionRequestBuilder from '../../../core/submit-questionnaire-responses/models/submission-request-model.js';

export default function makeSubmitQuestionnaireAnswersWebAPIController({
    submitQuestionnaireRespondeInputPort
}) {

    const submitQuestionnaireAnswersWebAPIControllerBehaviour = {
        execute
    };

    return Object.freeze(submitQuestionnaireAnswersWebAPIControllerBehaviour);

    function execute(webAPIRequest) {
        const body = webAPIRequest.body;

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

        const submissionRequest = builder.makeSubmissionRequest();
        return submitQuestionnaireRespondeInputPort.submit(submissionRequest);
    }

    function answerToInteger(answer) {
        const answerNum = toDecimal(answer.split('.').pop());
        return answerNum === 0 ? null : answerNum;
    }
}

//1.iii
//1.1.iv