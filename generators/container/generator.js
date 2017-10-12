/**
 * Component Generator from https://github.com/react-boilerplate/react-boilerplate
 */

/* eslint strict: ["off"] */

'use strict';

const appRoot = process.cwd();
module.exports = {
    description: 'Create a container',
    prompts: [{
        type: 'input',
        name: 'name',
        message: 'What should it be called?',
        default: 'Home',
    }],
    actions: () => {
        const actions = [{
            type: 'add',
            path: `${appRoot}/src/container/{{properCase name}}/index.js`,
            templateFile: './container/export.hbs',
            abortOnFail: true,
        }, {
            type: 'modify',
            path: `${appRoot}/src/container/index.js`,
            pattern: /(\/\/ DONT DELETE THIS LINE \/\/)/gi,
            templateFile: './container/containerExport.hbs',
            abortOnFail: true,
        }, {
            type: 'add',
            path: `${appRoot}/src/container/{{properCase name}}/{{properCase name}}.js`,
            templateFile: './container/container.hbs',
            abortOnFail: true,
        }, {
            type: 'add',
            path: `${appRoot}/src/container/{{properCase name}}/{{properCase name}}.md`,
            templateFile: './container/markdown.hbs',
            abortOnFail: true,
        }, {
            type: 'add',
            path: `${appRoot}/src/container/{{properCase name}}/{{properCase name}}.test.js`,
            templateFile: './container/test.hbs',
            abortOnFail: true,
        }, {
            type: 'add',
            path: `${appRoot}/src/container/{{properCase name}}/{{properCase name}}.module.css`,
            templateFile: './container/css.hbs',
            abortOnFail: true,
        }];
        return actions;
    },
};
