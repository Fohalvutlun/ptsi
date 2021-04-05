import buildMakeQuestionnaireSubmission from './questionnaire-submission.js';
import makeRiskProfile from '../risk-profile/index.js';

const makeQuestionnaireSubmission = buildMakeQuestionnaireSubmission({makeRiskProfile});

export default makeQuestionnaireSubmission;