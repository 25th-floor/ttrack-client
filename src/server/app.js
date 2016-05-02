var resources = require('./resources.js');
var express = require('express');
var cons = require('consolidate');
var pg = require('pg');
var fs = require('fs');
var raven = require('raven');

var app = express();

var config = require(__dirname + '/../../config.json');
var dbconfigfile = require(__dirname + '/../../database.json');
var dbconfig = dbconfigfile.dev;

// use NODE_ENV for defining which asset urls to use
var assetsJS = 'http://localhost:3000/app.js';
var assetsCSS = 'http://localhost:3000/app.css';
if (process.env.NODE_ENV == 'production') {
    assetsJS = '/app.js';
    assetsCSS = '/app.css';
}
console.log('nodeENV', process.env.NODE_ENV);

var buildInfo = {};
try {
    var fileName = __dirname + '/../../buildinfo.json';
    if (require.resolve(fileName)) {
        buildInfo = require(fileName);
    }
}
catch (e) {
}

// raven configuration
var sentry_client = undefined;
if (process.env.NODE_ENV === 'production' && config.sentry_client) {
    sentry_client = new raven.Client(config.sentry_client, {
        release: buildInfo.git || ''
    });
    sentry_client.patchGlobal();
}

app.engine('html', cons.mustache);
app.set('view engine', 'html');
app.set('views', __dirname + '/../../views');
app.set('sentry_client', sentry_client);

app.set('pg', function (fn) {
    pg.connect(dbconfig, function (err, client, done) {
        if (err) {
            return console.error('failed to retrieve client from pool');
        }
        fn(client);
        done();
    })
});

app.use('/api', resources.api);

app.use(express.static(__dirname + '/../../public'));

app.all(/.*/, function (req, res) {
    res.render('index', {css: assetsCSS, js: assetsJS, build: JSON.stringify(buildInfo)}, function (err, html) {
        if (err) {
            res.status(500).send('Internal Server Error').end();
        }
        res.send(html).end();
    });
});

var port = (config.webserver || {}).port || process.env.PORT || 8080;
app.listen(port);

console.log('listening on port ' + port + '...');

process.on('SIGINT', function () {
    process.exit();
});
