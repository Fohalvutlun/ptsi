export default function makeSubmitQuestionnaireAnswersWebAPIPresenter() {

    const submitQuestionnaireAnswersWebAPIPresenterBehaviour = {
        prepareSuccessView,
        prepareFailView
    };

    return Object.freeze(submitQuestionnaireAnswersWebAPIPresenterBehaviour);

    function prepareSuccessView(submissionResult) {
        const webSuccessResponse = {
            result: {
                riskProfile: submissionResult.riskProfile.level,
                grouping: {
                    name: submissionResult.schoolGrouping.name,
                    phoneContact: submissionResult.schoolGrouping.phoneContact,
                    emailContact: submissionResult.schoolGrouping.emailContact
                }
            }
        };

        return {
            statusCode: 201,
            body: webSuccessResponse
        }
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
        }
    }
}