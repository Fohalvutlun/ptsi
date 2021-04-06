import sql from 'mssql';
import { Sequelize } from 'sequelize';

const config = {
    user: 'ptsi',
    password: 'E8d@MSmV@J#usFVQks!r#pqJP9Gn97',
    server: 'ptsi-cyberbullying.database.windows.net',
    port: 1433,
    database: 'ptsi-cyberbullying',
    pool: {
        max: 2,
        min: 0,
        idleTimeoutMillis: (10 * 1000)
    },
    options: {
        encrypt: true,
        enableArithAbort: true  // Prevents a warning message from cluttering the terminal output
    }
};

const configString = 'Driver={ODBC Driver 13 for SQL Server};Server=tcp:ptsi-cyberbullying.database.windows.net,1433;Database=ptsi-cyberbullying;Uid=ptsi;Pwd={your_password_here};Encrypt=yes;TrustServerCertificate=no;Connection Timeout=30;';


async function test1() {
    const pool = await sql.connect(config);
    try {
        const result = await pool.query(`SELECT * FROM Tempo;`);
        console.dir(result);

    } catch (err) {
        throw err;
    }
}

async function test2() {
    const sequelize = new Sequelize(config.database, config.user, config.password, {
        host: config.server,
        port: config.port,
        dialect: 'mssql',
        pool: {
            max: config.pool.max,
            min: config.pool.min,
            idle: config.pool.idleTimeoutMillis
        },
        omitNull: true,
        dialectOptions: {
            options: {
                encrypt: true,
                enableArithAbort: true  // Prevents a warning message from cluttering the terminal output
            }
        }
    });

    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

await test2();