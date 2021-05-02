import makeSubmitQuestionnaireResponses from '../../main/core/submit-questionnaire-responses/submit-questionnaire-responses.js';
import makeSubmissionRequestBuilder from '../../main/core/submit-questionnaire-responses/models/submission-request-model.js';

import { strict as assert } from 'assert';

export default async function testSubmitQuestionnaireResponses(test_counter = 0) {
    const dummyGrouping = makeDummyGrouping();
    const stubs = makeInteractorStubs(dummyGrouping);
    const submitQuestionnaireResponses = makeSubmitQuestionnaireResponses(stubs);

    await testSubmitQuestionnaireResponse_For_Level1RiskProfile();
    await testSubmitQuestionnaireResponse_For_Level2RiskProfile();
    await testSubmitQuestionnaireResponse_For_Level3RiskProfile();

    return test_counter;

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

        await testAnswerCombo(3, 3, 3, 3, expected);

        test_counter += 1;
    }

    async function testSubmitQuestionnaireResponse_For_Level2RiskProfile() {
        const expected = {
            riskProfile: {
                level: 2,
                designation: "Amarelo"
            }, schoolGrouping: dummyGrouping
        };

        for (let q1a2 = 1; q1a2 <= 3; q1a2++) {
            for (let q2a2 = 1; q2a2 <= 3; q2a2++) {
                if (q1a2 !== 3 || q2a2 !== 3) {
                    await testAnswerCombo(3, q1a2, 3, q2a2, expected);
                    test_counter++;
                }
            }
        }
    }

    async function testSubmitQuestionnaireResponse_For_Level3RiskProfile() {
        const expected = {
            riskProfile: {
                level: 3,
                designation: "Vermelho"
            }, schoolGrouping: dummyGrouping
        };

        for (let q1a1 = 1; q1a1 <= 3; q1a1++) {
            for (let q1a4 = 1; q1a4 <= 3; q1a4++) {
                for (let q2a1 = 1; q2a1 <= 3; q2a1++) {
                    for (let q2a4 = 1; q2a4 <= 3; q2a4++) {
                        if (q1a1 !== 3 || q2a1 !== 3) {
                            await testAnswerCombo(q1a1, q1a4, q2a1, q2a4, expected);
                            test_counter++;
                        }
                    }
                }
            }
        }
    }
}
function makeMockRequestModelWithAnswerCombo(q1a1, q1a4, q2a1, q2a4) {
    return makeSubmissionRequestBuilder()
        .setRespondent(8, "f", "ESAS")
        .addAnswer(1, 1, q1a1)
        .addAnswer(1, 4, q1a4)
        .addAnswer(2, 1, q2a1)
        .addAnswer(2, 4, q2a4)
        .makeSubmissionRequest();
}

function makeDummyGrouping() {
    return {
        name: "teste",
        emailContact: "a@a.pt",
        phoneContact: "912345678"
    };
}

function makeInteractorStubs(dummyGrouping) {
    return {
        submitQuestionnaireResponseOutputPort: {
            prepareSuccessView: (o) => o,
            prepareFailView: (o) => o
        },
        submitQuestionnaireResponseGateway: {
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
        },
        submissionRequestValidator: {
            isValid: (o) => true
        }
    };
}