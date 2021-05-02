export default function makeSubmissionModel(sequelize, DataTypes, {
    Time,
    SchoolGrouping,
    RespondentProfile
}) {


    const submissionAttributes = {
        submissionId: {
            field: 'id_submissao',
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        risk: {
            field: 'risco',
            type: DataTypes.INTEGER,
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
        }
    }

    const submissionModel = sequelize.define('Submission', submissionAttributes, {
        tableName: 'Submissao',
        timestamps: false,
        createdAt: false,
        updatedAt: false,
        deletedAt: false
    });

    associateSubmissionToOne(Time, 'id_tempo');
    associateSubmissionToOne(SchoolGrouping, 'id_dados_agrupamento');
    associateSubmissionToOne(RespondentProfile, 'id_dados_sociodemograficos');

    return submissionModel;

    function associateSubmissionToOne(model, foreignKeyName) {
        model.hasMany(submissionModel, { foreignKey: foreignKeyName });
        submissionModel.belongsTo(model, { foreignKey: foreignKeyName });
    }
}