import fs from 'fs';
import makeAES256gcm from '../main/utilities/aes-256-gcm.js';

import Sequelize from 'sequelize';
import makeSequelizeModels from './plugins/sequelize/models/index.js';

import Express from 'express';
import makeExpressCallback from './plugins/express-web-api/express-callback/express-callback.js';
import makeExpressServer from './plugins/express-web-api/express-server/express-server.js';

import NodeCache from 'node-cache';
import makeNodeCacheModels from './plugins/node-cache/cache/index.js';

// Gateways
import makeSubmitQuestionnaireResponseGateway from './plugins/sequelize/submit-questionnaire-response-gateway/submit-questionnaire-response-gateway.js';
import makeSubmissionRequestModelValidatorGateway from './plugins/node-cache/submit-questionnaire-response-gateway/submission-request-model-validator-gateway.js';

// Controllers
import makeSubmitQuestionnaireAnswersWebAPIController from './plugins/express-web-api/submit-questionnaire-answers/submit-questionnaire-answers-web-api-controller.js';
// Presenters
import makeSubmitQuestionnaireAnswersWebAPIPresenter from './plugins/express-web-api/submit-questionnaire-answers/submit-questionnaire-answers-web-api-presenter.js';
// Use Cases
import makeSubmitQuestionnaireResponse from './core/submit-questionnaire-responses/submit-questionnaire-responses.js';
//Validators
import makeSubmissionRequestValidator from './core/submit-questionnaire-responses/submission-request-model-validator.js'


const ApplicationProperties = Object.assign({}, process.env);
const getSchoolGroupingDataRows = makeGetSchoolGroupingDataRows(makeAES256gcm(ApplicationProperties.INITIAL_DATA_KEY));


(async function main() {

    const sequelizeModels = await setupSequelizeModels();
    const nodeCacheModels = await setupNodeCache();

    const router = Express.Router();
    router.get('/status', (req, res) => { res.send('ON') });
    router.post('/questionnaire/response/submit',
        makeExpressCallback(
            makeSubmitQuestionnaireAnswersWebAPIController({
                submitQuestionnaireRespondeInputPort: makeSubmitQuestionnaireResponse({
                    submitQuestionnaireResponseOutputPort: makeSubmitQuestionnaireAnswersWebAPIPresenter(),
                    submitQuestionnaireResponseGateway: makeSubmitQuestionnaireResponseGateway(sequelizeModels),
                    submissionRequestValidator: makeSubmissionRequestValidator({
                        submissionRequestModelValidatorGateway: makeSubmissionRequestModelValidatorGateway(nodeCacheModels)
                    })
                })
            })));
    const app = makeExpressServer({ port: Number.parseInt(ApplicationProperties.WEB_PORT) }, router);
})();


/* 
    Helper Functions 
*/

// Initial Data
function makeGetSchoolGroupingDataRows({
    decryptFromBuffer
}) {
    const fileUrl = new URL(ApplicationProperties.INITIAL_DATA_PATH, import.meta.url);

    let jsonObject = null;
    let timeSinceLastModification = 0;

    return getSchoolGroupingDataRows;

    async function getSchoolGroupingDataRows() {
        const fileDescriptor = fs.openSync(fileUrl, 'r');
        const fileInfo = fs.fstatSync(fileDescriptor);

        if (timeSinceLastModification < fileInfo.mtimeMs) {
            timeSinceLastModification = fileInfo.mtimeMs;

            const json = await decryptFromBuffer(fs.readFileSync(fileDescriptor));
            jsonObject = JSON.parse(json);
        }

        fs.closeSync(fileDescriptor);
        return jsonObject;
    }
}

// Sequelize
async function setupSequelizeModels() {
    const sequelize = makeSequelize();

    await sequelize.authenticate();

    const models = makeSequelizeModels(sequelize);

    if (sequelize.getDialect() === 'sqlite') {
        await sequelize.sync();
        await loadInitialSequelizeData(models);
    }

    return models;
}

function makeSequelize() {
    if (ApplicationProperties.DB_URI) {
        return new Sequelize(ApplicationProperties.DB_URI, makeSequelizeOptions());
    }
    return new Sequelize(makeSequelizeOptions());
}

function makeSequelizeOptions() {
    return {
        database: ApplicationProperties.DB_NAME,
        username: ApplicationProperties.DB_USER,
        password: ApplicationProperties.DB_PASS,
        host: ApplicationProperties.DB_SERVER,
        port: Number.parseInt(ApplicationProperties.DB_PORT),
        dialect: ApplicationProperties.SEQUELIZE_DIALECT,
        pool: {
            max: Number.parseInt(ApplicationProperties.SEQUELIZE_POOL_MAX),
            min: Number.parseInt(ApplicationProperties.SEQUELIZE_POOL_MIN),
            idle: Number.parseInt(ApplicationProperties.SEQUELIZE_POOL_IDLE_TIMEOUT)
        },
        omitNull: ApplicationProperties.SEQUELIZE_OMIT_NULL === 'true',
        dialectOptions: {
            options: {
                encrypt: ApplicationProperties.SEQUELIZE_ENCRYPT === 'true',
                enableArithAbort: ApplicationProperties.SEQUELIZE_ARITH_ABORT === 'true'
            }
        }
    }
}

async function loadInitialSequelizeData(models) {
    const { Questionnaire, SchoolGrouping } = models;

    for (let num = 1; num <= 4; num++) {
        await Questionnaire.findCreateFind({ where: { designation: `Questionário nº${num}`, questionnaireCode: `${num}` } });
    }

    const dataRows = await getSchoolGroupingDataRows();
    // Skip header row
    for (let row = 1; row < dataRows.length; row++) {
        await SchoolGrouping.findCreateFind({
            where: {
                name: dataRows[row][0],
                phoneNumber: dataRows[row][1],
                email: dataRows[row][2],
                schoolGroupingCode: dataRows[row][3]
            }
        });
    }
}

// Node-Cache
async function setupNodeCache() {
    const models = makeNodeCacheModels(new NodeCache());

    await loadInitialNodeCacheData(models);

    return models;
}

async function loadInitialNodeCacheData(models) {
    const { QuestionnaireCodes, SchoolGroupingCodes } = models;

    for (let num = 1; num <= 4; num++) {
        QuestionnaireCodes.add(num);
    }

    const dataRows = await getSchoolGroupingDataRows();
    // Skip header row
    for (let row = 1; row < dataRows.length; row++) {
        SchoolGroupingCodes.add(dataRows[row][3]);
    }
}