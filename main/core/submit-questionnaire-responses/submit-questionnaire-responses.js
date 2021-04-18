import makeQuestionnaireSubmission from '../business-objects/questionnaire-submission/index.js';
import makeSchoolGrouping from '../business-objects/school-grouping/index.js';
import makeRespondent from '../business-objects/respondent/index.js';
import makeQuestionnaireResponse from '../business-objects/questionnaire-response/index.js';
import makeQuestionnaire from '../business-objects/questionnaire/index.js';
import makeAnswer from '../business-objects/answer/index.js';
import makeQuestion from '../business-objects/question/index.js';

import makeSubmissionResponseBuilder from './models/submission-response-model.js';
import makeGatewayRequestBuilder from './models/gateway-insert-request-model.js';


export default function makeSubmitQuestionnaireResponse({
    submitQuestionnaireResponseOutputPort,
    submitQuestionnaireResponseGateway,
    submissionRequestValidator
}) {

    return Object.freeze({ submit });

    async function submit(submissionRequest) {
        if (!submissionRequestValidator.isValid(submissionRequest)) {
            const failData = prepareFailData('The submission request is improperly formatted.');
            return submitQuestionnaireResponseOutputPort.prepareFailView(failData);
        }

        const
            questionnaireSubmission = await assembleQuestionnaireSubmission(submissionRequest),
            evaluatedRiskProfile = questionnaireSubmission.evaluateRiskProfile();


        const gatewayInsertRequest = prepareGatewayInserRequest(questionnaireSubmission);
        await submitQuestionnaireResponseGateway.insert(gatewayInsertRequest);


        const submissionResult = prepareSubmissionResult(evaluatedRiskProfile, questionnaireSubmission);
        return submitQuestionnaireResponseOutputPort.prepareSuccessView(submissionResult);
    }

    function prepareGatewayInserRequest(questionnaireSubmission) {
        const respondent = questionnaireSubmission.getRespondent();

        return makeGatewayRequestBuilder()
            .setRespondent(respondent.getAge(), respondent.getGender(), respondent.getSchoolGrouping())
            .setMomentOfSubmission(questionnaireSubmission.getMomentOfSubmission())
            .setQuestionnaireResponses(questionnaireSubmission.getQuestionnaireResponses())
            .makeGatewayRequest();
    }

    function prepareSubmissionResult(evaluatedRiskProfile, questionnaireSubmission) {
        const schoolGrouping = questionnaireSubmission.getRespondent().getSchoolGrouping();

        return makeSubmissionResponseBuilder()
            .setRiskProfile(evaluatedRiskProfile.getLevel(), evaluatedRiskProfile.getDesignation())
            .setSchoolGrouping(schoolGrouping.getName(), schoolGrouping.getPhoneContact(), schoolGrouping.getEmailContact())
            .makeSubmissionResponse();
    }

    function prepareFailData(message) {
        return {
            message
        };
    }

    // Push these assemblers to a factory?

    async function assembleQuestionnaireSubmission(submissionRequest) {
        const
            respondentData = submissionRequest.respondent,
            questionnaireResponsesData = submissionRequest.responses,
            respondent = await assembleRespondent(respondentData),
            questionnaireResponses = await assembleQuestionnaireResponses(questionnaireResponsesData);

        return makeQuestionnaireSubmission({
            momentOfSubmission: new Date(),
            respondent,
            questionnaireResponses
        });
    }

    async function assembleQuestionnaireResponses(questionnaireResponsesData) {
        const questionnaireResponses = new Map();

        for (let responseData of questionnaireResponsesData) {
            const response = await assembleQuestionnaireResponse(responseData);
            questionnaireResponses.set(response.getQuestionnaire().getCode(), response);
        }

        return questionnaireResponses;
    }

    async function assembleQuestionnaireResponse(questionnaireResponseData) {
        const
            questionnaire = await assembleQuestionnaire(questionnaireResponseData.questionnaireCode),
            answers = assembleAnswers(questionnaireResponseData.answers);

        return makeQuestionnaireResponse({
            questionnaire,
            answers
        })
    }

    async function assembleQuestionnaire(questionnaireCode) {
        const questionnaireData = await submitQuestionnaireResponseGateway.getQuestionnaireWithCodeEqualTo(questionnaireCode);
        return makeQuestionnaire(questionnaireData);
    }

    function assembleAnswers(answersData) {
        const answers = new Map();
        answersData.forEach((answerData) => {
            const answer = assembleAnswer(answerData);
            answers.set(answer.getQuestion().getIdentifier(), answer);
        });
        return answers;
    }

    function assembleAnswer(answerData) {
        const question = makeQuestion({ identifier: answerData.questionIdentifier });
        return makeAnswer({
            choice: answerData.answerChoice,
            question
        });
    }

    async function assembleRespondent(respondentData) {
        return makeRespondent({
            age: respondentData.age,
            gender: respondentData.gender,
            schoolGrouping: await assembleSchoolGrouping(respondentData.schoolGroupingCode)
        });
    }

    async function assembleSchoolGrouping(code) {
        const schoolGroupingData = await submitQuestionnaireResponseGateway.getSchoolGroupingWithCodeEqualTo(code);
        return makeSchoolGrouping(schoolGroupingData);
    }
}