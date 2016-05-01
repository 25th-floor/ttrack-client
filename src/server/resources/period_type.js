const db = require('../db');

module.exports = {
    list(pg, cb) {
        pg(function (client)
        {
            const query = db.periodTypes.select(db.periodTypes.star())
                .from(db.periodTypes).toQuery();
            db.query(client, query).then(function (result)
            {
                cb(result.rows);
            }).done();
        });
    },
};
