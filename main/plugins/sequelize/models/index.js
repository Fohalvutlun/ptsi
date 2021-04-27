import makeTimeModel from './time.js';
import makeSchoolGroupingModel from './school-grouping.js';
import makeRespondentProfileModel from './respondent-profile.js';
import makeQuestionnaireResponseModel from './questionnaire-response.js';
import makeQuestionnaireModel from './questionnaire.js';
import makeSubmissionModel from './submission.js';

import pkg from 'sequelize';
const { DataTypes } = pkg;

export default function makeSequelizeModels(sequelize) {
    const
        Time = makeTimeModel(sequelize, DataTypes),
        SchoolGrouping = makeSchoolGroupingModel(sequelize, DataTypes),
        RespondentProfile = makeRespondentProfileModel(sequelize, DataTypes),
        Questionnaire = makeQuestionnaireModel(sequelize, DataTypes),
        Submission = makeSubmissionModel(sequelize, DataTypes, {
            Time,
            SchoolGrouping,
            RespondentProfile,
        }),
        QuestionnaireResponse = makeQuestionnaireResponseModel(sequelize, DataTypes, {
            Questionnaire,
            Submission
        });

    return {
        Time,
        SchoolGrouping,
        RespondentProfile,
        Questionnaire,
        QuestionnaireResponse,
        Submission
    };
}