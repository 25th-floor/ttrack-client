module.exports = {
    list: function (pg, cb)
    {
        pg(function (db)
        {
            var query = 'SELECT * FROM users WHERE usr_employment_start IS NULL OR usr_employment_end IS NULL';
            db.query(query, function (err, result)
            {
                if (err) {
                    return console.error('error running select query', err);
                }
                cb(result.rows);
            });
        });
    },
    get: function (pg, userId, cb) {
        pg(function (db)
        {
            var query = 'SELECT * FROM users WHERE usr_id = $1';
            db.query(query, [userId], function (err, result)
            {
                if (err) {
                    return console.error('error running select query', err);
                }
                cb(result.rows[0]);
            });
        });

    },
    // get Users TargetTime for a specific date from the database
    getTargetTime: function (pg, userId, date, cb) {
        pg(function (db)
        {
            var query = 'SELECT * FROM user_get_target_time($1, $2::DATE)';
            db.query(query, [userId, date], function (err, result)
            {
                if (err) {
                    return console.error('error running select query', err);
                }
                cb(result.rows[0].user_get_target_time);
            });
        });
    }
};
