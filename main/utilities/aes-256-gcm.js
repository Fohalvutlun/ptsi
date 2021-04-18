import crypto from 'crypto';

export default function makeAES256gcm(key) {
    const BLOCK_BIT_LEN = 192;
    const ALGORITHM = `aes-192-cbc`;
    const SALT_RV = 'r7WqqBBK3yAXen%b&yewJ8fJW6n6&H';
    const KEY_LEN = (BLOCK_BIT_LEN / 8);
    const IV_LENGTH = 16;

    return Object.freeze({
        encryptToBuffer,
        decryptFromBuffer,
    });

    function encryptToBuffer(data) {
        return new Promise((res, rej) => {
            crypto.scrypt(key, SALT_RV, KEY_LEN, (err, derivedKey) => {
                if (err) rej(err);

                crypto.randomFill(Buffer.alloc(IV_LENGTH), (err, iv) => {
                    if (err) rej(err);

                    const cipher = crypto.createCipheriv(ALGORITHM, derivedKey, iv);

                    let encrypted = '';

                    cipher.setEncoding('hex');

                    cipher.on('data', (chunk) => encrypted += chunk);
                    cipher.on('end', () => {
                        const bufferData = iv.toString('hex').concat(':', encrypted);
                        const buffer = Buffer.from(bufferData);
                        res(buffer);
                    });

                    cipher.write(data);
                    cipher.end();
                });
            });
        });
    };

    function decryptFromBuffer(encryptedBuffer) {
        return new Promise((res, rej) => {
            crypto.scrypt(key, SALT_RV, KEY_LEN, (err, derivedKey) => {
                if (err) rej(err);

                const encrypted = encryptedBuffer.toString();
                const encryptedParts = encrypted.split(':');

                let iv = Buffer.from(encryptedParts.shift(), 'hex');
                const decipher = crypto.createDecipheriv(ALGORITHM, derivedKey, iv);

                let decrypted = '';
                decipher.on('readable', () => {
                    let chunk;
                    while (null !== (chunk = decipher.read())) {
                        decrypted += chunk.toString('utf8');
                    }
                });
                decipher.on('end', () => {
                    res(decrypted);
                });

                const encryptedData = encryptedParts.join(':');
                decipher.write(encryptedData, 'hex');
                decipher.end();
            });
        });
    };
};