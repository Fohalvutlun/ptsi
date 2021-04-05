import buildSubmitQuestionnaireResponses from '../main/core/submit-questionnaire-responses/submit-questionnaire-responses.js';
import makeSubmissionRequestBuilder from '../main/core/submit-questionnaire-responses/models/submission-request-model.js';

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
        receive: (o) => o
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

function makeMockRequestModelWithAnswerCombo(q1a1, q1a4, q2a1, q2a4) {
    return makeSubmissionRequestBuilder()
        .setRespondent(8, "f", "ESAS")
        .addAnswer(1, 1, q1a1)
        .addAnswer(1, 4, q1a4)
        .addAnswer(2, 1, q2a1)
        .addAnswer(2, 4, q2a4)
        .makeSubmissionRequest();
}


const submitQuestionnaireResponses = buildSubmitQuestionnaireResponses({
    submitQuestionnaireResponseOutputPort: outputPortStub,
    submitQuestionnaireResponseGateway: gatewayStub
});


function testSubmitQuestionnaireResponse_For_Level1RiskProfile() {

    function testAnswerCombo(q1a1, q1a4, q2a1, q2a4) {
        const dummy = makeMockRequestModelWithAnswerCombo(q1a1, q1a4, q2a1, q2a4);
        const response = submitQuestionnaireResponses.submit(dummy);
        assert.deepStrictEqual(response, {
            riskProfile: {
                level: 1,
                designation: "Verde"
            }, schoolGrouping: dummyGrouping
        });
    }

    for (let q1a1 = 1; q1a1 <= 2; q1a1++) {
        for (let q1a4 = 1; q1a4 <= 2; q1a4++) {
            for (let q2a1 = 1; q2a1 <= 2; q2a1++) {
                for (let q2a4 = 1; q2a4 <= 2; q2a4++) {
                    testAnswerCombo(q1a1, q1a4, q2a1, q2a4);
                    test_counter++;
                }
            }
        }
    }
}

function testSubmitQuestionnaireResponse_For_Level2RiskProfile() {

    function testAnswerCombo(q1a1, q1a4, q2a1, q2a4) {
        const dummy = makeMockRequestModelWithAnswerCombo(q1a1, q1a4, q2a1, q2a4);
        const response = submitQuestionnaireResponses.submit(dummy);
        assert.deepStrictEqual(response, {
            riskProfile: {
                level: 2,
                designation: "Amarelo"
            }, schoolGrouping: dummyGrouping
        });
    }
    testAnswerCombo(1, 1, 3, 1);
    testAnswerCombo(1, 1, 3, 2);

    testAnswerCombo(3, 1, 3, 1);
    testAnswerCombo(3, 1, 3, 2);

    testAnswerCombo(3, 2, 3, 1);
    testAnswerCombo(3, 2, 3, 2);

    test_counter += 6;
}

function testSubmitQuestionnaireResponse_For_Level3RiskProfile() {

    function testAnswerCombo(q1a1, q1a4, q2a1, q2a4) {
        const dummy = makeMockRequestModelWithAnswerCombo(q1a1, q1a4, q2a1, q2a4);
        const response = submitQuestionnaireResponses.submit(dummy);
        assert.deepStrictEqual(response, {
            riskProfile: {
                level: 3,
                designation: "Vermelho"
            }, schoolGrouping: dummyGrouping
        });
    }
    testAnswerCombo(1, 1, 3, 3);
    testAnswerCombo(3, 3, 1, 1);
    testAnswerCombo(3, 3, 3, 3);

    test_counter += 3;
}


let test_counter = 0;
const begin = Date.now();

testSubmitQuestionnaireResponse_For_Level1RiskProfile();
testSubmitQuestionnaireResponse_For_Level2RiskProfile();
testSubmitQuestionnaireResponse_For_Level3RiskProfile();

const elapsed = Date.now() - begin;
console.log("[TEST] " + test_counter + " tests done in " + elapsed + " ms")
