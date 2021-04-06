export default function makeSchoolGroupingModel(sequelize, DataTypes) {

    const schoolGroupingAttributes = {
        schoolGroupingId: {
            field: 'id_dados_agrupamento',
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        phoneNumber: {
            field: 'contacto',
            type: DataTypes.STRING(13),
            allowNull: false
        },
        email: {
            field: 'sexo',
            type: DataTypes.STRING(45),
            allowNull: false
        },
        schoolGroupingCode: {
            field: 'codigo_agrupamento',
            type: DataTypes.STRING(45),
            allowNull: false,
            unique: true
        }
    };

    return sequelize.define('SchoolGrouping', schoolGroupingAttributes, {
        tableName: 'Dados_Agrupamento'
    });


}