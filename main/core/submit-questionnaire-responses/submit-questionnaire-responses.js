import makeQuestionnaireSubmission from '../business-objects/questionnaire-submission/index.js'
import makeSchoolGrouping from '../business-objects/school-grouping/index.js';
import makeRespodent from '../business-objects/respondent/index.js';
import makeQuestionnaireResponse from '../business-objects/questionnaire-response/index.js';
import makeQuestionnaire from '../business-objects/questionnaire/index.js';
import makeAnswer from '../business-objects/answer/index.js';
import makeQuestion from '../business-objects/question/index.js';

import makeSubmissionResponseBuilder from './models/submission-response-model.js';
import makeGatewayRequestBuilder from './models/gateway-insert-request-model.js';


export default function buildSubmitQuestionnaireResponse({
    submitQuestionnaireResponseOutputPort,
    submitQuestionnaireResponseGateway
}) {
    
    return Object.freeze({ submit });

    function submit(submissionRequest) {
        const
            questionnaireSubmission = assembleQuestionnaireSubmission(submissionRequest.respondent, submissionRequest.responses),
            evaluatedRiskProfile = questionnaireSubmission.evaluateRiskProfile();


        const respondent = questionnaireSubmission.getRespondent(),
            schoolGrouping = respondent.getSchoolGrouping();

        const gatewayInsertRequest = makeGatewayRequestBuilder()
            .setRespondent(respondent.getAge(), respondent.getGender(), schoolGrouping)
            .setMomentOfSubmission(questionnaireSubmission.getMomentOfSubmission())
            .setQuestionnaireResponses(questionnaireSubmission.getQuestionnaireResponses())
            .makeGatewayRequest();

        submitQuestionnaireResponseGateway.insert(gatewayInsertRequest);


        const submissionResult = makeSubmissionResponseBuilder()
            .setRiskProfile(evaluatedRiskProfile.getLevel(), evaluatedRiskProfile.getDesignation())
            .setSchoolGrouping(schoolGrouping.getName(), schoolGrouping.getPhoneContact(), schoolGrouping.getEmailContact())
            .makeSubmissionResponse();
        return submitQuestionnaireResponseOutputPort.receive(submissionResult);
    }

    function assembleQuestionnaireSubmission(respondentData, questionnaireResponsesData) {
        const
            respondent = assembleRespodent(respondentData),
            questionnaireResponses = assembleQuestionnaireResponses(questionnaireResponsesData);

        return makeQuestionnaireSubmission({
            momentOfSubmission: new Date(),
            respondent,
            questionnaireResponses
        });
    }

    function assembleQuestionnaireResponses(questionnaireResponsesData) {
        const questionnaireResponses = new Map();
        questionnaireResponsesData.forEach((responseData) => {
            const response = assembleQuestionnaireResponse(responseData);
            questionnaireResponses.set(response.getQuestionnaire().getCode(), response);
        });
        return questionnaireResponses;
    }

    function assembleQuestionnaireResponse(questionnaireResponseData) {
        const
            questionnaire = assembleQuestionnaire(questionnaireResponseData.questionnaireCode),
            answers = assembleAnswers(questionnaireResponseData.answers);

        return makeQuestionnaireResponse({
            questionnaire,
            answers
        })
    }

    function assembleQuestionnaire(questionnaireCode) {
        const questionnaireData = submitQuestionnaireResponseGateway.getQuestionnaireWithCodeEqualTo(questionnaireCode);
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

    function assembleRespodent(respondentData) {
        return makeRespodent({
            age: respondentData.age,
            gender: respondentData.gender,
            schoolGrouping: assembleSchoolGrouping(respondentData.schoolGroupingCode)
        });
    }

    function assembleSchoolGrouping(code) {
        const schoolGroupingData = submitQuestionnaireResponseGateway.getSchoolGroupingWithCodeEqualTo(code);
        return makeSchoolGrouping(schoolGroupingData);
    }
}