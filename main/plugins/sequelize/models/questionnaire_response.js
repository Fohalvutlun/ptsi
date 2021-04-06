export default function makeQuestionnaireResponseModel(sequelize, DataTypes) {

    const questionnaireResponseAttributes = {
        questionnaireResponseId: {
            field: 'id_questionario',
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        questionNo1: {
            field: 'pergunta1',
            type: DataTypes.STRING(200),
            allowNull: false
        },
        questionNo2: {
            field: 'pergunta2',
            type: DataTypes.STRING(200),
            allowNull: true
        },
        questionNo3: {
            field: 'pergunta3',
            type: DataTypes.STRING(200),
            allowNull: true
        },
        questionNo4: {
            field: 'pergunta4',
            type: DataTypes.STRING(200),
            allowNull: false
        },
        questionNo5: {
            field: 'pergunta5',
            type: DataTypes.STRING(200),
            allowNull: true
        },
        questionNo6: {
            field: 'pergunta6',
            type: DataTypes.STRING(200),
            allowNull: true
        },
        risk: {
            field: 'pergunta1',
            type: DataTypes.STRING(45),
            allowNull: false
        },
        timeId: {
            field: 'id_tempo',
            type: DataTypes.INTEGER,
            allowNull: false
        },
        schoolGroupingId: {
            field: 'id_dados_agrupamento',
            type: DataTypes.INTEGER,
            allowNull: false
        },
        respondentProfileId: {
            field: 'id_dados_sociodemograficos',
            type: DataTypes.INTEGER,
            allowNull: false
        },
        questionnaireId: {
            field: 'id_questionario',
            type: DataTypes.INTEGER,
            allowNull: false
        }
    };

    return sequelize.define('QuestionnaireResponse', questionnaireResponseAttributes, {
        tableName: 'Respostas_Questionario'
    });
}