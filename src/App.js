import R from 'ramda';
import React from 'react';
import moment from 'moment';
import { Provider, connect } from 'react-redux';
import { Redirect, matchPath } from 'react-router';
import {
    withRouter,
    BrowserRouter as Router,
    Route,
    Switch,
} from 'react-router-dom';

import { AppContainer } from 'react-hot-loader';

import { store, Utils } from '@data';

import { MonthView, Auth as Authentication, VacationsOverview } from './container';

const today = moment().format('YYYY-MM');
const Index = () => <Redirect push to={`/month/${today}`} />;

const mapStateToProps = ({ auth }, { history }) => ({
    isAuthenticated: auth.isAuthenticated,
    user: auth.user,
    history,
});

const PrivateRoute = withRouter(connect(mapStateToProps, null)(({
    component: Component, path: RouterPath, validation = () => true, ...rest
}) => {
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
}));

const dateValidation = ({ user, location }, RouterPath) => {
    const match = matchPath(location.pathname, { path: RouterPath });
    const { date } = match.params;

    let activeMonth = moment.utc(date, 'YYYY-MM', true).startOf('month');
    if (!activeMonth.isValid()) activeMonth = Utils.getMomentToday();
    const found = Utils.getNearestDateWithinEmployment(activeMonth, user);

    // returns false if it is valid
    if (found === false) {
        return true;
    }

    const validDateFormat = Utils.getMomentToday().format('YYYY-MM');
    return `/month/${validDateFormat}`;
};

export const App = () => (
    <AppContainer>
        <Provider store={store}>
            <Router>
                <div>
                    <Switch>
                        <PrivateRoute path="/month/:date" validation={dateValidation} component={MonthView} />
                        <PrivateRoute path="/vacations" component={VacationsOverview} />
                        <PrivateRoute path="/" component={Index} />
                    </Switch>
                    <Route exact path="/auth" component={Authentication} />
                </div>
            </Router>
        </Provider>
    </AppContainer>
);

export default App;
