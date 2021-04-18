export default function makeQuestionnaireResponseModel(sequelize, DataTypes, {
    Time,
    SchoolGrouping,
    RespondentProfile,
    Questionnaire
}) {

    const questionnaireResponseAttributes = {
        questionnaireResponseId: {
            field: 'id_resposta_questionario',
            type: DataTypes.INTEGER,
            autoIncrement:true,
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
            field: 'risco',
            type: DataTypes.STRING(45),
            allowNull: false
        },
        timeId: {
            field: 'id_tempo',
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Time,
                key: 'id_tempo'
            }
        },
        schoolGroupingId: {
            field: 'id_dados_agrupamento',
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: SchoolGrouping,
                key: 'id_dados_agrupamento'
            }
        },
        respondentProfileId: {
            field: 'id_dados_sociodemograficos',
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: RespondentProfile,
                key: 'id_dados_sociodemograficos'
            }
        },
        questionnaireId: {
            field: 'id_questionario',
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Questionnaire,
                key: 'id_questionario'
            }
        }
    };

    const questionnaireResponseModel = sequelize.define('QuestionnaireResponse', questionnaireResponseAttributes, {
        tableName: 'Respostas_Questionario',
        timestamps: false,
        createdAt: false,
        updatedAt: false,
        deletedAt: false
    });

    associateManyQuestionnaireResponsesToOne(Time, 'id_tempo');
    associateManyQuestionnaireResponsesToOne(SchoolGrouping, 'id_dados_agrupamento');
    associateManyQuestionnaireResponsesToOne(RespondentProfile, 'id_dados_sociodemograficos');
    associateManyQuestionnaireResponsesToOne(Questionnaire, 'id_questionario');

    return questionnaireResponseModel;


    function associateManyQuestionnaireResponsesToOne(model, foreignKeyName) {
        model.hasMany(questionnaireResponseModel, { foreignKey: foreignKeyName });
        questionnaireResponseModel.belongsTo(model, { foreignKey: foreignKeyName });
    }
}