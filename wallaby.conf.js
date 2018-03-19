/* eslint-disable */

module.exports = function (wallaby) {
    process.env.DATABASE_URL = 'postgres://postgres:postgres@localhost:5432/ttrack_test';
    process.env.NODE_ENV = 'test';
    process.env.TZ = 'UTC';

    return {
        files: [
            'src/**/*.js',
            'src/**/*.css',
            '!src/**/*.test.js',
            'config/**/*.js',
        ],

        tests: ['src/**/*.test.js'],

        env: {
            type: 'node',
            runner: 'node',
        },

        compilers: {
            '**/*.js': wallaby.compilers.babel({
                babel: require('babel-core'),
                presets: ['react-app']
            }),
        },
        delays: {
            run: 1000,
        },

        setup: function (wallaby) {
            const jestConfig = require('./package.json').jest;
            jestConfig.setupFiles = jestConfig.setupFiles.map(p => p.replace('<rootDir>', wallaby.projectCacheDir));
            wallaby.testFramework.configure(jestConfig);
        },

        testFramework: 'jest',
    };
};
