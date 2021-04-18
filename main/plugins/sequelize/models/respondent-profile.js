export default function makeRespondentProfileModel(sequelize, DataTypes) {

    const respondentProfileAttributes = {
        profileId: {
            field: 'id_dados_sociodemograficos',
            type: DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey: true
        },
        age: {
            field: 'idade',
            type: DataTypes.INTEGER,
            allowNull: false
        },
        gender: {
            field: 'sexo',
            type: DataTypes.STRING(45),
            allowNull: false
        }
    };

    const respondentProfile = sequelize.define('RespondentProfile', respondentProfileAttributes, {
        tableName: 'Dados_Sociodemograficos',
        timestamps: false,
        createdAt: false,
        updatedAt: false,
        deletedAt: false
    });

    return respondentProfile;
}