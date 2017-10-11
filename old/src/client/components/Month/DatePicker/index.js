import PropTypes from 'prop-types';
import React from 'react';
import Immutable from 'immutable';

import YearSelection from './YearSelection';
import MonthSelection from './MonthSelection';

import styles from './less/DatePicker.less';

export default class extends React.Component {
    static propTypes = {
        activeMonth: PropTypes.object.isRequired,
        months: PropTypes.instanceOf(Immutable.List).isRequired,
        years: PropTypes.instanceOf(Immutable.List).isRequired,
        onChangeDate: PropTypes.func.isRequired,
    };

    render() {
        return (
            <div className={styles.dateSelection}>
                <div className={`row ${styles.touchVersion}`}>
                    <YearSelection
                        activeMonth={this.props.activeMonth}
                        years={this.props.years}
                        onChangeDate={this.props.onChangeDate}
                    />

                    <MonthSelection
                        activeMonth={this.props.activeMonth}
                        months={this.props.months}
                        onChangeDate={this.props.onChangeDate}
                    />
                </div>
            </div>
        );
    }
}
