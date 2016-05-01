import React from 'react';
import Immutable from 'immutable';
import DatePicker from './DatePicker';
import Weeks from './Weeks';

import styles from './less/Month.less';

export default React.createClass({
    propTypes: {
        user: React.PropTypes.object.isRequired,
        activeMonth: React.PropTypes.object.isRequired,
        weeks: React.PropTypes.instanceOf(Immutable.Map).isRequired,
        types: React.PropTypes.instanceOf(Immutable.List).isRequired,
        months: React.PropTypes.instanceOf(Immutable.List).isRequired,
        years: React.PropTypes.instanceOf(Immutable.List).isRequired,
        onChangeDate: React.PropTypes.func.isRequired,
        onSaveDay: React.PropTypes.func.isRequired,
    },

    render() {
        return (
            <div id={styles.month}>
                <div className={styles.pageHeader}>
                    <h1 className="hidden-lg hidden-md hidden-sm hidden-xs">Monats Ansicht</h1>

                    <DatePicker activeMonth={this.props.activeMonth}
                                months={this.props.months}
                                years={this.props.years}
                                onChangeDate={this.props.onChangeDate} />

                    <div className="clearfix"></div>
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

                <Weeks weeks={this.props.weeks} activeMonth={this.props.activeMonth} types={this.props.types}
                       user={this.props.user} onSaveDay={this.props.onSaveDay} />
            </div>
        );
    },
});


