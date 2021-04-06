export default function makeQuestionnaireModel(sequelize, DataTypes) {

    const questionnaireAttributes = {
        questionnaireId: {
            field: 'id_questionario',
            type: DataTypes.INTEGER,
            allowNull: false,
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

    return sequelize.define('Questionnaire', questionnaireAttributes, {
        tableName: 'Questionario'
    });

    
}
