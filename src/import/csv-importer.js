const fs = require('fs');
const nomnom = require('nomnom');
const pg = require('pg');
const csvParse = require('csv-parse');
const Q = require('q');
const _ = require('lodash');
const moment = require('moment');
require('moment-duration-format');

const util = require('./../common/util');
const db = require('../server/db');

const dbconfigfile = require(`${__dirname}/../../database.json`);
const dbconfig = dbconfigfile.dev;

nomnom.command('import')
    .option(
    'file',
    {
        abbr: 'f',
        help: 'csv file to import',
        required: true,
    },
)
    .option(
    'config',
    {
        abbr: 'c',
        default: 'config.json',
        help: 'configuration as json',
    },
)
    .option(
    'user',
    {
        abbr: 'u',
        required: true,
        help: 'The userid of the user to insert the data',
    },
)
    .callback(importFile)
    .help('Import shit');

nomnom.parse();

var csvColumns = [
    'week',
    'date',
    'start',
    'stop',
    'break',
    'comment',
    'workDuration',
    'weekSum',
    'weekDelta',
    '_',
    'default',
];
const csvCommentSpecials = {
    urlaub: 'Urlaub',
    krank: 'Krankenstand',
    pflege: 'Pflegeurlaub',
    feiertag: 'Feiertag',
};
const defaultPeriodType = 'Arbeitszeit';

function parseCsv(filename, opts) {
    return Q.Promise(function (resolve, reject) {
        const parser = csvParse(opts, function (err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
        fs.createReadStream(filename).pipe(parser);
    });
}

function readConfig(file) {
    return require(`${__dirname}/../../${file}`);
}

function getUser(client, userId) {
    const q = db.users
        .select('*')
        .from(db.users)
        .where(db.users.usr_id.equals(userId))
        .toQuery();
    return db.query(client, q)
        .then(function (result) {
            return result.rows[0];
        });
}

function importFile(opts) {
    const config = readConfig(opts.config);
    const userId = opts.user;
    const client = new pg.Client(dbconfig);
    client.connect(function (err) {
        if (err) {
            return console.error('could not connect to postgres', err);
        }
        parseCsv(opts.file, _.assign({}, config.csvImport, { columns: csvColumns }))
            .then(function (csvData) {
                return Q.all([csvData, getUser(client, userId), fetchExistingDays(client, userId)]);
            })
            .spread(function (csvData, user, existingDays) {
                const data = transformData(csvData, user, existingDays);
                return insertData(client, user, data);
            })
            .done(client.end.bind(client));
    });
}

function fetchExistingDays(client, userId) {
    const q = db.days
        .select(db.days.day_date)
        .from(db.days)
        .where(db.days.day_usr_id.equals(userId))
        .toQuery();
    return db.query(client, q)
        .then(function (result) {
            return result.rows.map(_.property('day_date'));
        });
}

function guessPeriodTypeByComment(comment) {
    const type = _.find(csvCommentSpecials, function (value, key) {
        return _.contains(comment.toLowerCase(), key);
    });
    return type || defaultPeriodType;
}

function isTimeString(str) {
    return /^[0-9]{2}:[0-9]{2}$/.test(str);
}

function processCsvRow(row, day) {
    const type = guessPeriodTypeByComment(row.comment);

    // if default type use start, stop and break, otherwise just set duration to 7.7 hours
    const data = type == defaultPeriodType
        ? { start: row.start, stop: row.stop, break: row.break || '00:00' }
        : { duration: day };

    return _.assign(
        data,
        {
            day: moment(row.date.substring(0, 10), 'DD.MM.YYYY'),
            comment: row.comment,
            type,
        },
    );
}

function isValidPeriod(period) {
    return period.day.isValid()
        && ((isTimeString(period.start) && isTimeString(period.stop))
        || isTimeString(period.duration));
}

function transformData(data, user, existingDays) {
    const existing = existingDays.map(function (day) {
        return day.valueOf();
    });
    // get full day duration for that user
    const day = util.getDayDuration(moment.duration(user.usr_target_time)).format('hh:mm');
    const rows = data.slice(1).map(function (row) {
        return processCsvRow(row, day);
    });
    const filtered = rows.filter(function (period) {
        return isValidPeriod(period)
            && !_.contains(existing, period.day.valueOf());
    });
    console.log(`${rows.length} rows`);
    console.log(`${rows.length - filtered.length} left out (like duplicates, weekends etc...)`);

    if (rows.length && !filtered.length) {
        console.log('bugger that!');
    }

    return filtered;
}

function insertData(client, user, data) {
    if (data.length) {
        console.log('inserting data..');
    }
    const selectTypes = db.periodTypes
        .select(db.periodTypes.pty_id, db.periodTypes.pty_name)
        .from(db.periodTypes)
        .toQuery();

    return db.query(client, selectTypes)
        .then(function (result) {
            const types = _.zipObject(_.map(result.rows, 'pty_name'), _.map(result.rows, 'pty_id'));
            return Q.all(data.map(insertPeriod.bind(null, client, types, user)));
        }).catch(function (err) {
            console.error('insert error: ', err.message, err);
        });
}

function createDayIdForUser(client, date, interval, userId) {
    const hours = parseInt(interval.hours) || 0;
    const minutes = parseInt(interval.minutes) || 0;

    // ugly hack because stupid query builder is buggy when converting interval object to database interval string himself,
    // and turns {hours: 7, minutes: 42} into interval '7 minutes, 42 seconds' ...
    let queryString = "INSERT INTO days (day_date, day_usr_id, day_target_time) VALUES ($1, $2, interval '$3 hours, $4 minutes') RETURNING day_id";
    queryString = queryString.replace('$3', hours);
    queryString = queryString.replace('$4', minutes);

    return db.query(client, queryString, [date.toDate(), userId]);
}

function insertPeriod(client, types, user, period) {
    const day = util.getDayDuration(moment.duration(user.usr_target_time));

    let target_time = null;

    if (moment(period.day) && moment(period.day).isoWeekday() < 6) {
        target_time = {
            hours: day.hours(),
            minutes: day.minutes(),
        };
    } else {
        target_time = { hours: 0 };
    }

    queryPromise = createDayIdForUser(client, period.day, target_time, user.usr_id);

    return queryPromise.then(function (result) {
        const dayId = result.rows[0].day_id;
        if (!dayId) {
            throw new Error('no dayId given');
        }
        const typeId = types[period.type];
        if (!typeId) {
            throw new Error(`period type unknown: ${JSON.stringify(period)}`);
        }
        const insertPeriod = db.periods.insert(
            db.periods.per_start.value(period.start),
            db.periods.per_stop.value(period.stop),
            db.periods.per_break.value(period.break),
            db.periods.per_duration.value(period.duration),
            db.periods.per_comment.value(period.comment),
            db.periods.per_pty_id.value(types[period.type]),
            db.periods.per_day_id.value(dayId)
        ).toQuery();
        return db.query(client, insertPeriod);
    });
}
