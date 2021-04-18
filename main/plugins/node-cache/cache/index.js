import makeQuestionnaireCodesModel from './questionnaire-codes.js';
import makeSchoolGroupingCodesModel from './school-grouping-codes.js';

export default function makeNodeCacheModels(nodeCache) {
    const
        QuestionnaireCodes = makeQuestionnaireCodesModel(nodeCache),
        SchoolGroupingCodes = makeSchoolGroupingCodesModel(nodeCache);

    return {
        QuestionnaireCodes,
        SchoolGroupingCodes
    }
}