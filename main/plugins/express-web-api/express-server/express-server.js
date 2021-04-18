import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import sanitizer from 'express-sanitizer';
import helmet from 'helmet';

export default function makeExpressServer(config, router) {
    const SERVER_PORT = config.port || '8080';
    const app = express();

    app.use(helmet());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(sanitizer());

    app.set('trust proxy', 1);

    app.use('/', router);

    // Start server
    var server = http.createServer(app);
    server.listen(SERVER_PORT);

    server.on('error', function (err) {
        console.error(err);
    });

    server.on('listening', function () {
        console.log('Server turned on %s, listening on port %d',
            new Date().toString(),
            server.address().port);
    });

    return app;
}