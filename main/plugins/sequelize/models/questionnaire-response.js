export default function makeQuestionnaireResponseModel(sequelize, DataTypes, {
    Questionnaire,
    Submission
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
            type: DataTypes.INTEGER,
            allowNull: false
        },
        questionNo2: {
            field: 'pergunta2',
            type: DataTypes.INTEGER,
            allowNull: true
        },
        questionNo3: {
            field: 'pergunta3',
            type: DataTypes.INTEGER,
            allowNull: true
        },
        questionNo4: {
            field: 'pergunta4',
            type: DataTypes.INTEGER,
            allowNull: false
        },
        questionNo5: {
            field: 'pergunta5',
            type: DataTypes.INTEGER,
            allowNull: true
        },
        questionNo6: {
            field: 'pergunta6',
            type: DataTypes.INTEGER,
            allowNull: true
        },
        risk: {
            field: 'risco',
            type: DataTypes.INTEGER,
            allowNull: false
        },
        questionnaireId: {
            field: 'id_questionario',
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Questionnaire,
                key: 'id_questionario'
            }
        },
        submissionId: {
            field: 'id_submissao',
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Submission,
                key: 'id_submissao'
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

    associateQuestionnaireResponsesToOne(Questionnaire, 'id_questionario');
    associateQuestionnaireResponsesToOne(Submission,'id_submissao');

    return questionnaireResponseModel;

    function associateQuestionnaireResponsesToOne(model, foreignKeyName) {
        model.hasMany(questionnaireResponseModel, { foreignKey: foreignKeyName });
        questionnaireResponseModel.belongsTo(model, { foreignKey: foreignKeyName });
    }
}