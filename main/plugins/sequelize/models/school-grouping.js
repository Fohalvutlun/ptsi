export default function makeSchoolGroupingModel(sequelize, DataTypes) {

    const schoolGroupingAttributes = {
        schoolGroupingId: {
            field: 'id_dados_agrupamento',
            type: DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey: true
        },
        name:{
            field: 'nome',
            type: DataTypes.STRING(200),
            allowNull: false
        },
        phoneNumber: {
            field: 'contacto',
            type: DataTypes.STRING(13),
            allowNull: false
        },
        email: {
            field: 'email',
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

    const schoolGrouping = sequelize.define('SchoolGrouping', schoolGroupingAttributes, {
        tableName: 'Dados_Agrupamento',
        timestamps: false,
        createdAt: false,
        updatedAt: false,
        deletedAt: false
    });

    return schoolGrouping;
}