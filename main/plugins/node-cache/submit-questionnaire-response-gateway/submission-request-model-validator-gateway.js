export default function makeSubmissionRequestModelValidatorGateway({
    SchoolGroupingCodes,
    QuestionnaireCodes
}) {

    const gateway = {
        isThereOneQuestionnaireWithCodeEqualTo,
        isThereOneSchoolGroupingWithCodeEqualTo
    }
    
    return Object.freeze(gateway);

    function isThereOneQuestionnaireWithCodeEqualTo(code) {
        return QuestionnaireCodes.has(code);

    }

    function isThereOneSchoolGroupingWithCodeEqualTo(code) {
        return SchoolGroupingCodes.has(code);
    }
};