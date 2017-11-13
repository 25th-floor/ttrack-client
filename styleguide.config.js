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
            name: 'Auth Containers',
            components: 'src/container/Auth/**/*.js',
        },
        {
            name: 'MonthView Containers',
            components: 'src/container/MonthView/**/*.js',
        },
    ],
    ignore: [
        '**/*.test.js',
        '**/index.js',
    ],
};
