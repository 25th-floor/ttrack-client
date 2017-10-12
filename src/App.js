import React from 'react';
import { Provider, connect } from 'react-redux';
import { Redirect } from 'react-router';
import {
    withRouter,
    BrowserRouter as Router,
    Route,
} from 'react-router-dom';

import { AppContainer } from 'react-hot-loader';

import { store } from '@data';

import { Home, Auth as Authentication } from './container';

const Index = bla => <Redirect push to="/home" />;

const PrivateRouteC = ({ component: Component, ...rest }) => {
    // on /auth do nothing
    if (rest.history.location.pathname === '/auth') return null;
    if (!rest.isAuthenticated) return (<Redirect push to="/auth" />);
    return <Route {...rest} render={props => <Component {...props} />} />;
};

const mapStateToProps = ({ isAuthenticated, user }, { history }) => ({
    isAuthenticated,
    user,
    history,
});

const PrivateRoute = withRouter(
    connect(mapStateToProps, null)(PrivateRouteC),
);

const Protected = () => (<h1> HELLO WORLD </h1>);

export const App = () => (
    <AppContainer>
        <Provider store={store}>
            <Router>
                <div>
                    <PrivateRoute exact path="/" component={Index} />
                    <PrivateRoute path="/home" component={Home} />
                    <PrivateRoute path="/foobar" component={Protected} />
                    <Route exact path="/auth" component={Authentication} />
                </div>
            </Router>
        </Provider>
    </AppContainer>
);

export default App;
