import sql from 'mssql';

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
    },
};




async function test() {
    const pool = await sql.connect(config);
    try {
        const result = await pool.query(`SELECT * FROM Tempo;`);
        console.dir(result);

    } catch (err) {
        throw err;
    }
}
await test();