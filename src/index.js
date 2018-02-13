import React from 'react';
import ReactDOM from 'react-dom';

import { App } from './App';
// import global css like bootstrap etc
import './assets';

if (module.hot) {
    module.hot.accept('./App', () => {
        const NextApp = require('./App').default; // eslint-disable-line global-require
        ReactDOM.render(<NextApp />, document.getElementById('app'));
    });
}

ReactDOM.render(<App />, document.getElementById('app'));
