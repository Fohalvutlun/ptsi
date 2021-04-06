export default function makeTimeModel(sequelize, DataTypes) {

    const timeAttributes = {
        timeId: {
            field: 'id_tempo',
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        day: {
            field: 'dia',
            type: DataTypes.INTEGER,
            allowNull: false
        },
        month: {
            field: 'mes',
            type: DataTypes.INTEGER,
            allowNull: false
        },
        year: {
            field: 'ano',
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    };

    return sequelize.define('Time', timeAttributes, {
        tableName: 'Tempo'
    });
}