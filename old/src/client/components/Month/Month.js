import PropTypes from 'prop-types';
import React from 'react';
import Immutable from 'immutable';
import DatePicker from './DatePicker';
import Weeks from './Weeks';

import styles from './less/Month.less';

export default class extends React.Component {
    static propTypes = {
        user: PropTypes.object.isRequired,
        activeMonth: PropTypes.object.isRequired,
        weeks: PropTypes.instanceOf(Immutable.Map).isRequired,
        types: PropTypes.instanceOf(Immutable.List).isRequired,
        months: PropTypes.instanceOf(Immutable.List).isRequired,
        years: PropTypes.instanceOf(Immutable.List).isRequired,
        onChangeDate: PropTypes.func.isRequired,
        onSaveDay: PropTypes.func.isRequired,
    };

    render() {
        return (
            <div id={styles.month}>
                <div className={styles.pageHeader}>
                    <h1 className="hidden-lg hidden-md hidden-sm hidden-xs">Monats Ansicht</h1>

                    <DatePicker
                        activeMonth={this.props.activeMonth}
                        months={this.props.months}
                        years={this.props.years}
                        onChangeDate={this.props.onChangeDate}
                    />

                    <div className="clearfix" />
                </div>

                <fieldset className={styles.monthHeader}>
                    <dl>
                        <dt className="col-sm-3 col-md-1 col-lg-1">Datum</dt>
                        <dt className="hidden-sm col-md-2 tt-col-lg-1 col-lg-1">Wochentag</dt>
                        <dt className="col-sm-1 col-lg-1">Arbeitszeit</dt>
                        <dt className="col-sm-1 tt-col-lg-1">Pause</dt>
                        <dt className="col-sm-1 col-lg-1">Differenz</dt>
                        <dt className="col-sm-4 col-lg-6">Kommentar</dt>
                    </dl>
                </fieldset>

                <Weeks
                    weeks={this.props.weeks} activeMonth={this.props.activeMonth} types={this.props.types}
                    user={this.props.user} onSaveDay={this.props.onSaveDay}
                />
            </div>
        );
    }
}
