import sql from 'mssql';

export default function buildMakeSubmitQuestionnaireResponseGateway({
    configs,
}) {

    const connection = getConnection();

    const gateway = {
        insert,
        getQuestionnaireWithCodeEqualTo,
        getSchoolGroupingWithCodeEqualTo
    }
    return function makeSubmitQuestionnaireResponseGateway() {
        return Object.freeze(gateway);
    };

    function insert(gatewayRequestModel) {

    }

    function getQuestionnaireWithCodeEqualTo(questionnaireCode) {
        const queryString = 'SELECT TOP 1'
            + ' id_questionario , descricao, codigo_questionario'
            + ' FROM Questionario WHERE codigo_questionario = @code';

        const queryResult = await sql.connect(configs)
            .input('code', sql.VarChar, questionnaireCode)
            .query(queryString);

        if (queryResult.recordset.length == 0) {
            throw new Error('No School Grouping was found for the provided code');
        }

        return {
            code: queryResult.recordset[0],
            designation: queryResult.recordset[0]
        }
    }

    function getSchoolGroupingWithCodeEqualTo(schoolGroupingCode) {
        connection
    }
};