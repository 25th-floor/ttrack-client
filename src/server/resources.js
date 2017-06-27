const express = require('express');

const api = express();
const bodyParser = require('body-parser');

const User = require('./resources/user');
const Period = require('./resources/period');
const PeriodType = require('./resources/period_type');
const Timesheet = require('./resources/timesheet');

api.use(bodyParser.json()); // for parsing application/json
api.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

/**
 * add extra debug information to sentry
 */
api.use((req, res, next) => {
    const sentryClient = api.get('sentry_client');
    if (!sentryClient) {
        next();
        return;
    }

    // add request information
    sentryClient.mergeContext({
        extra: {
            url: req.originalUrl,
            method: req.method,
            params: req.params,
            request: req,
        },
    });

    next();
});

/**
 * add user information to the sentry client so we have this data to debug in case of errors
 */
api.param('user', (req, res, next, id) => {
    // try to get the user details from the User model and attach it to the request object
    User.get(api.get('pg'), id, (user) => {
        if (user) {
            const sentryClient = api.get('sentry_client');
            if (sentryClient) {
                sentryClient.mergeContext({ user });
            }
            next();
        } else {
            next(new Error('failed to load user'));
        }
    });
});

api.get('/users', (req, res) => {
    console.info('API GET Request for Users');
    User.list(api.get('pg'), (users) => {
        res.json(users);
    });
});

api.get('/period-types', (req, res) => {
    console.info('API GET Request for Period Types');
    PeriodType.list(api.get('pg'), (types) => {
        res.json(types);
    });
});

api.get('/users/:user/timesheet/:from/:to', (req, res) => {
    console.info('API GET Request for Timesheet', req.params.from, 'to', req.params.to, 'for user', req.params.user);
    Timesheet.get(api.get('pg'), req.params.user, req.params.from, req.params.to, (timesheet) => {
        res.json(timesheet);
    });
});

api.post('/users/:user/periods', (req, res) => {
    console.info('API POST Request for Period for user', req.params.user);
    const data = req.body;
    data.userId = req.params.user;

    // Validation
    if (!validateData(data, res)) {
        return;
    }
    // POST specific Validation
    if (!data.date) {
        res.status(400).send('Missing Date!').end();
        return;
    }

    Period.post(api.get('pg'), req.params.user, data, (period) => {
        res.status(201);
        res.json(period);
    });
});

api.put('/users/:user/periods/:id', (req, res) => {
    console.info('API PUT Request for Period', req.params.id, 'for user', req.params.user);

    const data = req.body;
    data.per_id = parseInt(req.params.id, 10);

    // Validation
    if (!validateData(data, res)) {
        return;
    }

    Period.put(api.get('pg'), req.params.user, data, (period) => {
        res.json(period);
    });
});

api.delete('/users/:user/periods/:id', (req, res) => {
    console.info('API DELETE Request for Period');
    Period.delete(api.get('pg'), req.params.id, req.params.user, () => {
        res.status(204).end();
    });
});

api.all(/.*/, (req, res) => {
    res.status(405).send('Bad Request').end();
});

function validateData(data, res) {
    if (!data.per_pty_id) {
        res.status(400).send('Missing Period Type!').end();
        return false;
    }

    if (!data.per_start && !data.per_duration) {
        res.status(400).send('Missing Data \'Start\' or \'Duration\'!').end();
        return false;
    }

    return true;
}

exports.api = api;
