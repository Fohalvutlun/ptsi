//import('./submit-questionnaire-responses.js');

import fs from 'fs';
import makeAES256gcm from '../main/utilities/aes-256-gcm.js';

const { encryptToBuffer, decryptFromBuffer } = makeAES256gcm(process.env.INITIAL_DATA_KEY);

const data = fs.readFileSync(new URL('../resources/schoolGroupings.bak', import.meta.url), 'utf8');
const encrypted = await encryptToBuffer(data);
/*
const fd = fs.openSync(new URL('../resources/schoolGroupings.data', import.meta.url),'w');
fs.writeSync(fd,encrypted);
*/

const fd = fs.openSync(new URL('../resources/schoolGroupings.data', import.meta.url),'r');
const json = fs.readFileSync(fd);
console.log(JSON.parse(await decryptFromBuffer(json)));


fs.closeSync(fd);