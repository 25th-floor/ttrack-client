/**
 * Component Generator from https://github.com/react-boilerplate/react-boilerplate
 */

/* eslint strict: ["off"] */

'use strict';

const appRoot = process.cwd();
module.exports = {
    description: 'Add an unconnected component',
    prompts: [{
        type: 'list',
        name: 'type',
        message: 'Select the type of component',
        default: 'ES6 Class',
        choices: () => ['ES6 Class', 'Stateless Function', 'ES6 Class (Pure)'],
    }, {
        type: 'directory',
        name: 'path',
        message: 'Where',
        basePath: `${appRoot}/src`,
    }, {
        type: 'input',
        name: 'name',
        message: 'What should it be called?',
        default: 'Button',
    }],
    actions: (data) => {
        let componentTemplate;

        switch (data.type) {
            case 'ES6 Class': {
                componentTemplate = './component/classComponent.hbs';
                break;
            }
            case 'ES6 Class (Pure)': {
                componentTemplate = './component/pureComponent.hbs';
                break;
            }
            case 'Stateless Function': {
                componentTemplate = './component/statelessComponent.hbs';
                break;
            }
            default: {
                componentTemplate = './component/classComponent.hbs';
            }
        }
        const actions = [{
            type: 'add',
            path: `${appRoot}/src/{{path}}/{{properCase name}}/{{properCase name}}.js`,
            templateFile: componentTemplate,
            abortOnFail: true,
        }, {
            type: 'add',
            path: `${appRoot}/src/{{path}}/{{properCase name}}/{{properCase name}}.test.js`,
            templateFile: './component/test.js.hbs',
            abortOnFail: true,
        }, {
            type: 'add',
            path: `${appRoot}/src/{{path}}/{{properCase name}}/{{properCase name}}.md`,
            templateFile: './component/markdown.hbs',
            abortOnFail: true,
        }, {
            type: 'add',
            path: `${appRoot}/src/{{path}}/{{properCase name}}/{{properCase name}}.module.css`,
            templateFile: './component/css.hbs',
            abortOnFail: true,
        }, {
            type: 'add',
            path: `${appRoot}/src/{{path}}/{{properCase name}}/index.js`,
            templateFile: './component/import.hbs',
            abortOnFail: true,
        }];
        return actions;
    },
};
