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
api.use(function (req, res, next) {
    const sentry_client = api.get('sentry_client');
    if (!sentry_client) {
        next();
        return;
    }

    // add request information
    sentry_client.setExtraContext({
        url: req.originalUrl,
        method: req.method,
        params: req.params,
        request: req
    });

    next();
});

/**
 * add user information to the sentry client so we have this data to debug in case of errors
 */
api.param('user', function (req, res, next, id) {
    // try to get the user details from the User model and attach it to the request object
    User.get(api.get('pg'), id, function (user) {
        if (user) {
            const sentry_client = api.get('sentry_client');
            if (sentry_client) {
                sentry_client.setUserContext(user);
            }
            next();
        } else {
            next(new Error('failed to load user'));
        }
    });
});

api.get('/users', function (req, res) {
    console.log('API GET Request for Users');
    User.list(api.get('pg'), function (users) {
        res.json(users);
    });
});

api.get('/period-types', function (req, res) {
    console.log('API GET Request for Period Types');
    PeriodType.list(api.get('pg'), function (types) {
        res.json(types);
    });
});

api.get('/users/:user/timesheet/:from/:to', function (req, res) {
    console.log('API GET Request for Timesheet', req.params.from, 'to', req.params.to, 'for user', req.params.user);
    Timesheet.get(api.get('pg'), req.params.user, req.params.from, req.params.to, function (timesheet) {
        res.json(timesheet);
    });
});

api.post('/users/:user/periods', function (req, res) {
    console.log('API POST Request for Period for user', req.params.user);
    const data = req.body;
    validateData(data, res);

    Period.post(api.get('pg'), req.params.user, data, function (period) {
        res.json(period);
    });
});

api.put('/users/:user/periods/:id', function (req, res) {
    console.log('API PUT Request for Period', req.params.id, 'for user', req.params.user);

    const data = req.body;
    if (req.params.id != data.per_id) {
        res.status(400).send('Invalid Id!').end();
    }

    validateData(data, res);

    Period.put(api.get('pg'), req.params.user, data, function (period) {
        res.json(period);
    });
});

api.delete('/users/:user/periods/:id', function (req, res) {
    console.log('API DELETE Request for Period');
    Period.delete(api.get('pg'), req.params.id, req.params.user, function (periods) {
        res.status(204).end();
    });
});

function validateData(data, res) {
    if (!data.userId || !data.per_pty_id) {
        res.status(400).send('Missing Data!').end();
        return false;
    }

    if (!data.per_start && !data.per_duration) {
        res.status(400).send('Missing Data \'Start\' or \'Duration\'!').end();
        return false;
    }

    return true;
}

exports.api = api;
