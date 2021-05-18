import testSummarizeQuestionGateway from './test.summarize-question-gateway.js';
import testSummarizeQuestion from './test.summarize-question.js';

export default async (overall_test_counter = 0) => {
    let test_counter = 0;
    const begin = Date.now();

    test_counter = await testSummarizeQuestion(test_counter);
    test_counter = await testSummarizeQuestionGateway(test_counter);

    const elapsed = Date.now() - begin;
    console.log(`[TEST - RUN] SummarizeQuestion: \n\t ${test_counter} tests done in ${elapsed} ms`);

    return overall_test_counter + test_counter;
}