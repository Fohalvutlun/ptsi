import { strict as assert } from 'assert';

import makeSubmitQuestionnaireAnswersWebAPIController
    from '../../main/plugins/express-web-api/submit-questionnaire-answers/submit-questionnaire-answers-web-api-controller.js';

const webRequestMock = {
    body: {
        respondent: {
            age: 6,
            gender: 'F',
            groupingCode: 'ESAS'
        },
        questionnaireResponses: [{
            questionnaireCode: 1,
            response: {
                question1: '1.i',
                question1_1: '1.1.i',
                question1_2: '1.2.i',
                question2: '2.i',
                question2_1: '2.1.i',
                question2_2: '2.2.i'
            }
        }, {
            questionnaireCode: 2,
            response: {
                question1: '1.i',
                question1_1: '1.1.i',
                question1_2: '1.2.iv',
                question2: '2.iii',
                question2_1: '2.1.ii',
                question2_2: '2.2.i'
            }
        }]
    }
}

const useCaseMock = {
    submit: (o) => {
        return o;
    }
}

const submitQuestionnaireAnswersWebAPIController = makeSubmitQuestionnaireAnswersWebAPIController({
    submitQuestionnaireRespondeInputPort: useCaseMock
});

console.log(submitQuestionnaireAnswersWebAPIController.execute(webRequestMock));