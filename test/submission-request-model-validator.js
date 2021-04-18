import { strict as assert } from 'assert';

import makeSubmissionRequestValidator from '../main/core/submit-questionnaire-responses/submission-request-model-validator.js';
import makeSubmissionRequestBuilder from '../main/core/submit-questionnaire-responses/models/submission-request-model.js';

const mock = makeSubmissionRequestBuilder()
        .setRespondent(8, "f", "ESAS")
        .addAnswer(1, 1, 1)
        .addAnswer(1, 4, 1)
        .addAnswer(2, 1, 1)
        .addAnswer(2, 4, 1)
        .makeSubmissionRequest();

const validator = makeSubmissionRequestValidator();

console.log(validator.isValid(mock));