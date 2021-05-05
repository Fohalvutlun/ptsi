export default function makeSummarizeQuestionRequestBuilder() {

    const responseData = {
        questionNumber: null,
        questionSummary: {
            answerChoiceAndQuestionnairePairTotals: []
        }
    };

    const builderBehaviour = {
        setQuestionNumber,
        addAnswerChoiceAndQuestionnairePairTotals,
        makeSummarizeQuestionResponse
    };

    return Object.freeze(builderBehaviour);

    function setQuestionNumber(questionNumber) {
        responseData.questionNumber = questionNumber;
        return Object.freeze(builderBehaviour);
    }

    function addAnswerChoiceAndQuestionnairePairTotals(choiceNumber, questionnaireCode, total) {
        responseData.questionSummary.answerChoiceAndQuestionnairePairTotals.push({
            choiceNumber, questionnaireCode, total
        });
        return Object.freeze(builderBehaviour);
    }

    function makeSummarizeQuestionResponse() {
        return Object.assign({}, responseData);
    }
}