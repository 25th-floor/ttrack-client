'use strict';

// add styles
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootflat/bootflat/css/bootflat.min.css';
import 'font-awesome/css/font-awesome.css';
import './less/main.less';

import _ from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';

import * as timeUtils from '../common/timeUtils';

import mottos from './mottos';

import userStore from './store/userStore';
import timesheetStore from './store/timesheetStore';
import navStore from './store/navStore';

import App from './components/App';
import Login from './components/Login';
import Month from './components/Month';

// EXTERNAL DEPENDENCY, maybe there is another way?
var buildInfo = BUILD_INFO;

let motto = _.sample(mottos);
let users = userStore(renderApp);
let timesheet = timesheetStore(renderApp);
let nav = navStore(() => {
    loadTimesheet();
    renderApp();
});

function loadTimesheet() {
    let activeMonth = nav.getActiveMonth();
    let activeUser = users.getActiveUser();

    // check if activeMonth is out of scope of employment or too far in the future
    let found = timeUtils.getNearestDateWithinEmployment(activeMonth, activeUser);
    if (found) {
        changeDate(found);
        return;
    }

    // user may not have a start/enddate because reasons!

    timesheet.loadTimesheet(activeMonth, activeUser.get('usr_id'));
}

function login(user) {
    users.login(user);
    loadTimesheet();
}

function logout() {
    users.logout();
    timesheet.resetTimesheet();
}

function changeDate(date) {
    nav.gotoMonth(date);
    loadTimesheet();
}

function saveDay(date, periods, removed) {
    timesheet.saveDay(users.getActiveUser().get('usr_id'), date, periods, removed).then(() => loadTimesheet());
}

function renderMainComponent() {
    if (!users.getActiveUser()) {
        return (
            <Login motto={motto}
                   users={users.getUsers()}
                   onUserSelect={login}
                   build={buildInfo} />
        );
    }

    return (
        <App user={users.getActiveUser()}
             motto={motto}
             logout={logout}
             build={buildInfo}>
            <Month
                user={users.getActiveUser()}
                activeMonth={nav.getActiveMonth()}
                years={timeUtils.getYearsForUser(users.getActiveUser(), timeUtils.getMomentToday())}
                months={timeUtils.getMonthsForUser(users.getActiveUser(), nav.getActiveMonth())}
                weeks={timesheet.getTimesheet()}
                types={timesheet.getTypes()}
                onChangeDate={changeDate}
                onSaveDay={saveDay}/>
        </App>
    );
}

function renderApp() {
    ReactDOM.render(renderMainComponent(), window.app);
}

function initApp() {
    return Promise
        .all([nav.init(), users.init(), timesheet.init()])
        .then(() => users.getActiveUser() ? loadTimesheet() : Promise.resolve())
        .catch(err => console.error(err));
}

initApp();

// check if time has changed and if it has, move along and reload everything (this helps with the calculations)
let today = moment().format("YYYY-MM-DD");
//setInterval(renderApp, 5000); // just rerender every 5 seconds
setInterval(function() {
    var now = moment().format("YYYY-MM-DD");
    if (today == now) return;
    today = now;

    timesheet.resetTimesheet();
    loadTimesheet();
}, 5000); // just rerender every 5 seconds
