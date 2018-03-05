import React from 'react';
import moment from 'moment';
import { Provider } from 'react-redux';
import { Redirect, matchPath } from 'react-router';
import {
    BrowserRouter as Router,
    Route,
    Switch,
} from 'react-router-dom';

import { AppContainer } from 'react-hot-loader';

import { store, Utils } from '@data';
import { LoadingApplication, PrivateRoute } from '@components';

import { MonthView, Auth as Authentication, VacationsOverview } from './container';

const today = moment().format('YYYY-MM');
const Index = () => <Redirect push to={`/month/${today}`} />;

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
            <LoadingApplication>
                <Router>
                    <div>
                        <Switch>
                            <PrivateRoute path="/month/:date" validation={dateValidation}><MonthView /></PrivateRoute>
                            <PrivateRoute path="/vacations"><VacationsOverview /></PrivateRoute>
                            <PrivateRoute path="/"><Index /></PrivateRoute>
                        </Switch>
                        <Route exact path="/auth" component={Authentication} />
                    </div>
                </Router>
            </LoadingApplication>
        </Provider>
    </AppContainer>
);

export default App;
