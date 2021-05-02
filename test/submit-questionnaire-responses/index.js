import testSubmitQuestionnaireResponses from './test.submit-questionnaire-responses.js';

export default async (overall_test_counter = 0) => {
    let test_counter = 0;
    const begin = Date.now();

    test_counter = await testSubmitQuestionnaireResponses(test_counter);

    const elapsed = Date.now() - begin;
    console.log(`[TEST - RUN] SubmitQuestionnaireResponses: \n\t ${test_counter} tests done in ${elapsed} ms`);

    return overall_test_counter + test_counter;
}