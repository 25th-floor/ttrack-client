/* eslint strict: ["off"] */
const componentGenerator = require('./component/index.js');
const container = require('./container/generator.js');

function main(plop) {
    plop.addPrompt('directory', require('inquirer-directory'));
    plop.setGenerator('component', componentGenerator);
    plop.setGenerator('container', container);
}

module.exports = main;
