import testSubmitQuestionnaireResponsesUC from './submit-questionnaire-responses/index.js';
import testSummarizeQuestionnaireResponsesUC from './summarize-questionnaire-responses/index.js';
import testSummarizeQuestionUC from './summarize-question/index.js';

let test_counter = 0;
const begin = new Date();
console.log(`[TEST - START] Started testing at ${begin.toISOString()}.`)


test_counter = await testSubmitQuestionnaireResponsesUC(test_counter);
test_counter = await testSummarizeQuestionnaireResponsesUC(test_counter);
test_counter = await testSummarizeQuestionUC(test_counter);


const end = new Date();
const elapsed = end.getTime() - begin.getTime();
console.log(`[TEST - END] Completed testing at ${end.toISOString()}. \n\t Completed a total of ${test_counter} tests in ${elapsed} ms`);