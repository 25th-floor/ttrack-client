/* eslint-disable import/no-dynamic-require*/
const resources = require('./resources.js');
const express = require('express');
const cons = require('consolidate');
const pg = require('pg');
const raven = require('raven');

const app = express();

const dbconfigfile = require(`${__dirname}/../../database.json`);
const dbconfig = dbconfigfile.dev;

// use NODE_ENV for defining which asset urls to use
let assetsJS = 'http://localhost:3000/app.js';
let assetsCSS = 'http://localhost:3000/app.css';
if (process.env.NODE_ENV === 'production') {
    assetsJS = '/app.js';
    assetsCSS = '/app.css';
}
console.info('nodeENV', process.env.NODE_ENV);

let buildInfo = {};
try {
    const fileName = `${__dirname}/../../buildinfo.json`;
    if (require.resolve(fileName)) {
        // eslint-disable-next-line global-require
        buildInfo = require(fileName);
    }
// eslint-disable-next-line no-empty
} catch (e) {}

// raven configuration
let sentryClient;
if (process.env.SENTRY_TOKEN) {
    sentryClient = new raven.Client(process.env.SENTRY_TOKEN, {
        release: buildInfo.git || '',
        environment: process.env.NODE_ENV,
    });
    sentryClient.patchGlobal();
}

app.engine('html', cons.mustache);
app.set('view engine', 'html');
app.set('views', `${__dirname}/../../views`);
app.set('sentry_client', sentryClient);

app.set('pg', (fn) => {
    pg.connect(dbconfig, (err, client, done) => {
        if (err) {
            return console.error('failed to retrieve client from pool');
        }
        fn(client);
        done();
        return true;
    });
});

app.use('/api', resources.api);

app.use(express.static(`${__dirname}/../../public`));

app.all(/.*/, (req, res) => {
    res.render('index', { css: assetsCSS, js: assetsJS, build: JSON.stringify(buildInfo) }, (err, html) => {
        if (err) {
            res.status(500).send('Internal Server Error').end();
        }
        res.send(html).end();
    });
});

const port = process.env.PORT || 8080;
app.listen(port);

console.info(`listening on port ${port}...`);

process.on('SIGINT', () => {
    process.exit();
});
