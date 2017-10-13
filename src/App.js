import R from 'ramda';
import React from 'react';
import moment from 'moment';
import { Provider, connect } from 'react-redux';
import { Redirect, matchPath } from 'react-router';
import {
    withRouter,
    BrowserRouter as Router,
    Route,
} from 'react-router-dom';

import { AppContainer } from 'react-hot-loader';

import { store, Utils } from '@data';

import { Home, Auth as Authentication } from './container';

const Index = bla => <Redirect push to="/month" />;

/* const PrivateRouteC = ({ component: Component, ...rest }) => {
    // on /auth do nothing
    if (rest.history.location.pathname === '/auth') return null;
    if (!rest.isAuthenticated) return (<Redirect push to="/auth" />);
    return <Route {...rest} render={props => <Component {...props} />} />;
}; */

const mapStateToProps = ({ isAuthenticated, user }, { history }) => ({
    isAuthenticated,
    user,
    history,
});

const PrivateRoute = withRouter(
    connect(mapStateToProps, null)(({ component: Component, path: RouterPath, validation = () => true, ...rest }) => {
        // on /auth do nothing
        if (rest.history.location.pathname === '/auth') return null;
        if (!rest.isAuthenticated) return (<Redirect push to="/auth" />);
        const valid = validation(rest, RouterPath);
        if (R.is(String, valid)) {
            rest.history.push(valid);
            return null;
        }

        return (<Route
            path={RouterPath}
            {...rest}
            render={props => <Component {...props} />}
        />);
    }),
);

const dateValidation = ({ user, location }, RouterPath) => {
    const match = matchPath(location.pathname, { path: RouterPath });
    const { date } = match.params;

    let activeMonth = moment(date, 'YYYY-MM', true).startOf('month');
    if (!activeMonth.isValid()) activeMonth = Utils.getMomentToday();
    const found = Utils.getNearestDateWithinEmployment(activeMonth, user);

    // returns false if it is valid
    if (found === false) {
        return !found;
    }

    const validDateFormat = Utils.getMomentToday().format('YYYY-MM');
    return `/month/${validDateFormat}`; // (<Redirect push to={`/month/${validDateFormat}`} />);
};

const Foobar = () => (
    <h1>hello 1</h1>
);

const Foo = () => (
    <h1>hello 2</h1>
);

export const App = () => (
    <AppContainer>
        <Provider store={store}>
            <Router>
                <div>
                    <PrivateRoute exact path="/" component={Index} />
                    <PrivateRoute exact path="/month" component={Home} />
                    <PrivateRoute exact path="/month/:date" validation={dateValidation} component={Home} />
                    <Route exact path="/auth" component={Authentication} />
                </div>
            </Router>
        </Provider>
    </AppContainer>
);

export default App;
