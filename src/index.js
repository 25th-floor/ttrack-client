import React from 'react';
import ReactDOM from 'react-dom';

import { App } from './App';
// import global css like bootstrap etc
import './assets';

import { startServices } from './services';

if (module.hot) {
    module.hot.accept('./App', () => {
        const NextApp = require('./App').default; // eslint-disable-line global-require
        ReactDOM.render(<NextApp />, document.getElementById('root'));
    });
}

ReactDOM.render(<App />, document.getElementById('root'));
startServices();
