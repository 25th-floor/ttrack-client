const next = require('postcss-cssnext');
const modules = require('postcss-modules');
const postcss = require('postcss');

module.exports = function (file, done) {
    postcss([
        next,
        modules({
            getJSON(filename, json) {
                console.log('JSON : ', json);
                file.rename(`${file.path}.json`);
                done(JSON.stringify(json));
            },
        }),
    ]).process(file.content, {
        from: file.path,
        to: file.path,
    }).catch((err) => {
        throw err;
    });
};
