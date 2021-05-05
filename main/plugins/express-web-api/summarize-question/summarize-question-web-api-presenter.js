export default function makeSummarizeQuestionWebAPIPresenter() {

    const summarizeQuestionWebAPIPresenterBehaviour = {
        prepareSuccessView,
        prepareFailView
    };

    return Object.freeze(summarizeQuestionWebAPIPresenterBehaviour);

    function prepareSuccessView(summarizeResult) {
        const webSuccessResponse = {
            responses: preapreChoiceTotalsByQuestionnaire(summarizeResult.questionSummary)
        };
        return {
            statusCode: 200,
            body: webSuccessResponse
        };
    }

    function prepareFailView(failData) {
        const webErrorResponse = {
            error: {
                errorMessage: failData.message
            }
        };
        return {
            statusCode: 400,
            body: webErrorResponse
        };
    }

    function preapreChoiceTotalsByQuestionnaire({ answerChoiceAndQuestionnairePairTotals }) {
        const map = makeQuestionnaireMapOfChoiceTotals(answerChoiceAndQuestionnairePairTotals);
        return prepareResponsesArray(map)
    }

    function makeQuestionnaireMapOfChoiceTotals(pairs) {
        return pairs.reduce((questionnaireMap, { choiceNumber, questionnaireCode, total }) =>
            addChoiceTotalToMap(questionnaireMap, questionnaireCode, choiceNumber, total),
            new Map())
    }

    function addChoiceTotalToMap(map, mapKey, choice, total) {
        const choiceTotalData = [prepareChoiceTotalData(choice, total)];
        return map.has(mapKey) ?
            map.set(mapKey, map.get(mapKey).concat(choiceTotalData)) :
            map.set(mapKey, choiceTotalData)
    }

    function prepareResponsesArray(map) {
        return Array.from(map, ([k, v]) => prepareChoiceTotalByQuestionnaireData(k, v));
    }

    function prepareChoiceTotalByQuestionnaireData(questionnaireCode, choices) {
        return { questionnaireCode, choices };
    }

    function prepareChoiceTotalData(choice, total) {
        return { choice, total };
    }
}