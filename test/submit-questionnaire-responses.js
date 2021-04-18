import makeSubmitQuestionnaireResponses from '../main/core/submit-questionnaire-responses/submit-questionnaire-responses.js';
import makeSubmissionRequestBuilder from '../main/core/submit-questionnaire-responses/models/submission-request-model.js';
import makeSubmissionRequestValidator from '../main/core/submit-questionnaire-responses/submission-request-model-validator.js'

import { strict as assert } from 'assert';

// Shared Dummy Objects
const dummyGrouping = {
    name: "teste",
    emailContact: "a@a.pt",
    phoneContact: "912345678"
};

// Stubs
const
    outputPortStub = {
        prepareSuccessView: (o) => o,
        prepareFailView: (o) => o
    },
    gatewayStub = {
        insert: (o) => {
            return true;
        },
        getQuestionnaireWithCodeEqualTo: (code) => {
            return {
                code: code,
                designation: "Teste"
            }
        },
        getSchoolGroupingWithCodeEqualTo: (code) => {
            return {
                code: code,
                name: dummyGrouping.name,
                emailContact: dummyGrouping.emailContact,
                phoneContact: dummyGrouping.phoneContact
            }
        }
    };

const submitQuestionnaireResponses = makeSubmitQuestionnaireResponses({
    submitQuestionnaireResponseOutputPort: outputPortStub,
    submitQuestionnaireResponseGateway: gatewayStub,
    submissionRequestValidator: makeSubmissionRequestValidator()
});

function makeMockRequestModelWithAnswerCombo(q1a1, q1a4, q2a1, q2a4) {
    return makeSubmissionRequestBuilder()
        .setRespondent(8, "f", "ESAS")
        .addAnswer(1, 1, q1a1)
        .addAnswer(1, 4, q1a4)
        .addAnswer(2, 1, q2a1)
        .addAnswer(2, 4, q2a4)
        .makeSubmissionRequest();
}

async function testAnswerCombo(q1a1, q1a4, q2a1, q2a4, expected) {
    const dummy = makeMockRequestModelWithAnswerCombo(q1a1, q1a4, q2a1, q2a4);
    const response = await submitQuestionnaireResponses.submit(dummy);
    assert.deepStrictEqual(response, expected);
}

async function testSubmitQuestionnaireResponse_For_Level1RiskProfile() {
    const expected = {
        riskProfile: {
            level: 1,
            designation: "Verde"
        }, schoolGrouping: dummyGrouping
    };

    for (let q1a1 = 1; q1a1 <= 2; q1a1++) {
        for (let q1a4 = 1; q1a4 <= 2; q1a4++) {
            for (let q2a1 = 1; q2a1 <= 2; q2a1++) {
                for (let q2a4 = 1; q2a4 <= 2; q2a4++) {
                    await testAnswerCombo(q1a1, q1a4, q2a1, q2a4, expected);
                    test_counter++;
                }
            }
        }
    }
}

async function testSubmitQuestionnaireResponse_For_Level2RiskProfile() {
    const expected = {
        riskProfile: {
            level: 2,
            designation: "Amarelo"
        }, schoolGrouping: dummyGrouping
    };

    await testAnswerCombo(1, 1, 3, 1, expected);
    await testAnswerCombo(1, 1, 3, 2, expected);

    await testAnswerCombo(3, 1, 3, 1, expected);
    await testAnswerCombo(3, 1, 3, 2, expected);

    await testAnswerCombo(3, 2, 3, 1, expected);
    await testAnswerCombo(3, 2, 3, 2, expected);

    test_counter += 6;
}

async function testSubmitQuestionnaireResponse_For_Level3RiskProfile() {

    const expected = {
        riskProfile: {
            level: 3,
            designation: "Vermelho"
        }, schoolGrouping: dummyGrouping
    };

    await testAnswerCombo(1, 1, 3, 3, expected);
    await testAnswerCombo(3, 3, 1, 1, expected);
    await testAnswerCombo(3, 3, 3, 3, expected);

    test_counter += 3;
}


let test_counter = 0;
const begin = Date.now();

await testSubmitQuestionnaireResponse_For_Level1RiskProfile();
await testSubmitQuestionnaireResponse_For_Level2RiskProfile();
await testSubmitQuestionnaireResponse_For_Level3RiskProfile();

const elapsed = Date.now() - begin;
console.log("[TEST] " + test_counter + " tests done in " + elapsed + " ms")
