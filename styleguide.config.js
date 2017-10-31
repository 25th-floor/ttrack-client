/* eslint-disable */
// https://raw.githubusercontent.com/just-boris/react-app-styleguidist/master/styleguide.config.js
module.exports = {
    assetsDir: './public',
    title: 'TTRACK',
    showCode: true,
    require: ['./src/assets/index'],
    webpackConfig: require('./config/webpack.config.dev.js'),
    sections: [
        {
            name: 'Global',
            components: 'src/node_modules/@components/**/*.js',
        },
        {
            name: 'Containers',
            components: 'src/container/**/*.js',
        },
    ],
    ignore: [
        '**/*.test.js',
        '**/index.js',
    ],
};