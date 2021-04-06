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
        const momentOfSubmission = gatewayRequestModel.momentOfSubmission
    }

    function getQuestionnaireWithCodeEqualTo(questionnaireCode) {
        const
            attrNames = getQuesstionnaireTableStructure().attr,
            tableName = getQuesstionnaireTableStructure().tableName,
            queryString = 'SELECT TOP 1'
                + ` ${attrNames.id}, ${attrNames.code}, ${attrNames.designation}`
                + ` FROM ${tableName} WHERE ${attrNames.code} = '${questionnaireCode}'`;

        const records = await queryAtLeastOneRecord(queryString, () => {
            throw new Error('No Questionnaire was found for the provided code');
        });

        return {
            code: records[0][attrNames.code],
            designation: records[0][attrNames.designation]
        };
    }

    function getSchoolGroupingWithCodeEqualTo(schoolGroupingCode) {
        const
            attrNames = getSchoolGroupingTableStructure().attrs,
            tableName = getSchoolGroupingTableStructure().tableName,
            queryString = 'SELECT TOP 1'
                + ` ${attrNames.id}, ${attrNames.code}, ${attrNames.designation}`
                + ` FROM ${tableName} WHERE ${attrNames.code} = '${schoolGroupingCode}';`;

        const records = await queryAtLeastOneRecord(queryString, () => {
            throw new Error('No School Grouping was found for the provided code');
        });

        return {
            code: records[0][attrNames.code],
            name: records[0][attrNames.name],
            emailContact: records[0][attrNames.emailContact],
            phoneContact: records[0][attrNames.phoneContact]
        };
    }

    async function queryAtLeastOneRecord(sqlString, errorHandler) {
        const queryResult = await sql.connect(configs).request()
            .query(sqlString);

        if (queryResult.recordset.length == 0) {
            errorHandler();
        }

        return queryResult.recordset;
    }

    function getQuesstionnaireTableStructure() {
        return {
            tableName: 'Questionario',
            attrs: {
                id = 'id_questionario',
                code = 'codigo_questionario',
                designation = 'descricao'
            }
        };
    }

    function getSchoolGroupingTableStructure() {
        return {
            tableName: 'Dados_Agrupamento',
            attrs: {
                id: 'id_dados_agrupamento',
                code: 'codigo_agrupamento',
                name: 'nome',
                emailContact: 'email',
                phoneContact: 'contacto'
            }
        };
    }


};