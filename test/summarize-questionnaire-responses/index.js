import testSummarizeQuestionnaireResponsesGateway from './test.summarize-questionnaire-responses-gateway.js';
import testSummarizeQuestionnaireResponses from './test.summarize-questionnaire-responses.js';

export default async (overall_test_counter = 0) => {
    let test_counter = 0;
    const begin = Date.now();

    test_counter = await testSummarizeQuestionnaireResponsesGateway(test_counter);
    test_counter = await testSummarizeQuestionnaireResponses(test_counter);

    const elapsed = Date.now() - begin;
    console.log(`[TEST - RUN] SummarizeQuestionnaireResponses: \n\t ${test_counter} tests done in ${elapsed} ms`);

    return overall_test_counter + test_counter;
}