var db = require('../db');

module.exports = {
    list: function (pg, cb)
    {
        pg(function (client)
        {
            var query = db.periodTypes.select(db.periodTypes.star())
                .from(db.periodTypes).toQuery();
            db.query(client, query).then(function (result)
            {
                cb(result.rows);
            }).done();
        });
    }
};
