import React from 'react';
import { Redirect } from 'react-router';
import {
    BrowserRouter as Router,
    Route,
} from 'react-router-dom';

import { AppContainer } from 'react-hot-loader';

// setup State machine
import { Provider } from 'react-redux';
import { store } from '@data';

import { Home, Auth as Authentication } from './container';

const Index = () => (<Redirect to="/home" />);


export const App = () => (
    <AppContainer>
        <Provider store={store}>
            <Router>
                <div>
                    <Authentication />
                    <Route exact path="/" component={Index} />
                    <Route path="/home" component={Home} />
                </div>
            </Router>
        </Provider>
    </AppContainer>
);

export default App;
