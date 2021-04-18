export default function makeQuestionnaireModel(sequelize, DataTypes) {

    const questionnaireAttributes = {
        questionnaireId: {
            field: 'id_questionario',
            type: DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey: true
        },
        designation: {
            field: 'descricao',
            type: DataTypes.STRING(45),
            allowNull: false
        },
        questionnaireCode: {
            field: 'codigo_questionario',
            type: DataTypes.STRING(45),
            allowNull: false,
            unique: true
        }
    };

    const questionnaireModel = sequelize.define('Questionnaire', questionnaireAttributes, {
        tableName: 'Questionario',
        timestamps: false,
        createdAt: false,
        updatedAt: false,
        deletedAt: false
    });

    return questionnaireModel;
}
