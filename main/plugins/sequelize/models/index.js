import makeTimeModel from './time.js';
import makeSchoolGroupingModel from './school-grouping.js';
import makeRespondentProfileModel from './respondent-profile.js';
import makeQuestionnaireResponseModel from './questionnaire-response.js';
import makeQuestionnaireModel from './questionnaire.js';

import pkg from 'sequelize';
const { DataTypes } = pkg;

export default function makeSequelizeModels(sequelize) {
    const
        Time = makeTimeModel(sequelize, DataTypes),
        SchoolGrouping = makeSchoolGroupingModel(sequelize, DataTypes),
        RespondentProfile = makeRespondentProfileModel(sequelize, DataTypes),
        Questionnaire = makeQuestionnaireModel(sequelize, DataTypes),
        QuestionnaireResponse = makeQuestionnaireResponseModel(sequelize, DataTypes, {
            Time,
            SchoolGrouping,
            RespondentProfile,
            Questionnaire
        });

    return {
        Time,
        SchoolGrouping,
        RespondentProfile,
        Questionnaire,
        QuestionnaireResponse
    };
}