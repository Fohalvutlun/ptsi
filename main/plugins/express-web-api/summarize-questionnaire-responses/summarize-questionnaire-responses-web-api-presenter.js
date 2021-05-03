export default function makeSummarizeQuestionnaireResponsesWebAPIPresenter() {

    const summarizeQuestionnaireResponsesWebAPIPresenterBehaviour = {
        prepareSuccessView,
        prepareFailView
    };

    return Object.freeze(summarizeQuestionnaireResponsesWebAPIPresenterBehaviour);

    function prepareSuccessView(summarizeResult) {
        const webSuccessResponse = {
            summary: makeSummary(summarizeResult),
            filtered: makeFiltered(summarizeResult)

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


    // Helpers
    function makeSummary(summarizeResult) {
        return {
            totalSubmissions: summarizeResult.totalSubmissions,
            submissionRiskProfileTotals: makeRiskLevelTotals(summarizeResult.totalSubmissionsByRiskLevel),
            submissionGenderTotals: makeGenderTotals(summarizeResult.totalSubmissionsByGender),
            submissionAgeGroupTotals: makeAgeGroupTotals(summarizeResult.totalSubmissionsByAge),
            responseReactionTotals: makeReactionTotals(summarizeResult.totalResponsesByChoiceToReactionQuestions)
        }
    }

    function makeFiltered({ totalFilteredSubmissionsByRiskLevel }) {
        return {
            submissionRiskProfileTotals: makeRiskLevelTotals(totalFilteredSubmissionsByRiskLevel)
        };
    }

    function makeRiskLevelTotals(riskTotalsMap) {
        return {
            level1: makeTotal(riskTotalsMap, 1),
            level2: makeTotal(riskTotalsMap, 2),
            level3: makeTotal(riskTotalsMap, 3)
        };
    }

    function makeGenderTotals(genderTotalsMap) {
        return {
            male: makeTotal(genderTotalsMap, 'm'),
            female: makeTotal(genderTotalsMap, 'f')
        };
    }

    function makeAgeGroupTotals(ageTotalsMap) {
        return {
            ages6_9: makeSumTotalForKeyArray(ageTotalsMap, ints(6, 9)),
            ages10_12: makeSumTotalForKeyArray(ageTotalsMap, ints(10, 12))
        };
    }

    function makeReactionTotals(reactionTotals) {
        return makeChoiceTotalsArray(mergeSameReactionTotals(Array.from(reactionTotals.values())));
    }

    function makeChoiceTotalsArray(reactionTotalsMap) {
        return Array.from(reactionTotalsMap.entries()).reduce((choiceTotalsArr, [choice, total]) =>
            choiceTotalsArr.concat([Object.assign({ choice, total })]),
            []);
    }

    function mergeSameReactionTotals(reactionTotalsPerQuestion) {
        return reactionTotalsPerQuestion.reduce((tallyMap, choiceTotalPairs) =>
            addToTallyKVPairs(tallyMap, Array.from(choiceTotalPairs)),
            new Map());
    }

    function addToTallyKVPairs(tallyMap, kvPairs) {
        return kvPairs.reduce((tallyMap, [key, value]) =>
            addToTally(tallyMap, key, value),
            tallyMap);
    }

    function addToTally(map, key, value) {
        return map.has(key) ? map.set(key, map.get(key) + value) : map.set(key, value);
    }

    function makeTotal(totalsMap, key) {
        return totalsMap.has(key) ? totalsMap.get(key) : 0;
    }

    function makeSumTotalForKeyArray(totalsMap, keyArray) {
        return keyArray.reduce((sumTotal, key) => sumTotal + makeTotal(totalsMap, key), 0);
    }

    function ints(from, to) {
        return from > to ? [] : [to].concat(ints(from, to - 1));
    }
}