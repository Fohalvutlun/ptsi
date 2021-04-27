import { strict as assert } from 'assert';
import { Sequelize } from 'sequelize';

import makeSequelizeModels from '../../main/plugins/sequelize/models/index.js';
import buildMakeSubmitQuestionnaireResponseGateway from '../../main/plugins/sequelize/submit-questionnaire-response-gateway/submit-questionnaire-response-gateway.js'

import buildSubmitQuestionnaireResponses from '../../main/core/submit-questionnaire-responses/submit-questionnaire-responses.js';
import makeSubmissionRequestBuilder from '../../main/core/submit-questionnaire-responses/models/submission-request-model.js';

const sequelize = new Sequelize('sqlite::memory:');
const models = makeSequelizeModels(sequelize);
await sequelize.sync({ force: true });

const gway = buildMakeSubmitQuestionnaireResponseGateway(models);

// Shared Dummy Objects
const dummyGrouping = {
    name: "teste",
    emailContact: "a@a.pt",
    phoneContact: "912345678"
};

// Inserts to DB 
await models.SchoolGrouping.create({
    name: dummyGrouping.name,
    phoneNumber: dummyGrouping.phoneContact,
    email: dummyGrouping.emailContact,
    schoolGroupingCode: 'ESAS'
});
await models.Questionnaire.bulkCreate([
    {
        designation: 'Questionário 1',
        questionnaireCode: '1'
    }, {
        designation: 'Questionário 2',
        questionnaireCode: '2'
    }
]);

// Stubs
let
    outputPortStub = {
        prepareSuccessView: (o) => o,
        prepareFailView: (o) => o
    },
    gatewayStub = gway,
    validatorStub = {
        isValid: (o) => true
    };


const submitQuestionnaireResponses = buildSubmitQuestionnaireResponses({
    submitQuestionnaireResponseOutputPort: outputPortStub,
    submitQuestionnaireResponseGateway: gatewayStub,
    submissionRequestValidator: validatorStub
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

async function testSubmitQuestionnaireResponse_For_Level3RiskProfile() {

    async function testAnswerCombo(q1a1, q1a4, q2a1, q2a4) {
        const dummy = makeMockRequestModelWithAnswerCombo(q1a1, q1a4, q2a1, q2a4);
        const response = await submitQuestionnaireResponses.submit(dummy);
        assert.deepStrictEqual(response, {
            riskProfile: {
                level: 3,
                designation: "Vermelho"
            }, schoolGrouping: dummyGrouping
        });
    }
    await testAnswerCombo(1, 1, 3, 3);
}


try {
    testSubmitQuestionnaireResponse_For_Level3RiskProfile();
} catch (err) {
    console.error(err);
}