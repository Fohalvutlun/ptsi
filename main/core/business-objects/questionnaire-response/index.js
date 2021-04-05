import buildMakeQuestionnaireResponse from './questionnaire-response.js';
import makeRiskProfile from '../risk-profile/index.js';

const makeQuestionnaireResponse = buildMakeQuestionnaireResponse({makeRiskProfile});

export default makeQuestionnaireResponse;