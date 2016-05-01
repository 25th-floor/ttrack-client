import moment from 'moment';
import myro from 'myro';

import * as timeUtils from '../../common/timeUtils';

let router = myro({
    '/month/:month': 'month'
});

function dispatchRouter() {
    return router(document.location.pathname);
}

function activeMonthFromRoute(route) {
    if (route && route.$name == 'month' && route.$params.month) {
        // todo : check if month is valid!
        return moment(route.$params.month, 'YYYY-MM', true);
    } else {
        return timeUtils.getMomentToday();
    }
}

export default function (onChange) {

    let notify = () => onChange ? onChange() : null;
    let activeMonth = timeUtils.getMomentToday();

    let dispatch = () => {
        let route = dispatchRouter();
        activeMonth = activeMonthFromRoute(route);
    };

    return {
        init() {
            window.onpopstate = () => {
                dispatch();
                notify();
            };
            dispatch();
            return Promise.resolve();
        },
        getActiveMonth() {
            return activeMonth;
        },
        gotoMonth(month) {
            let path = router.month({ month: month.format('YYYY-MM') });
            activeMonth = month;
            window.history.pushState(null, '', path);
            notify();
        }
    };
}
