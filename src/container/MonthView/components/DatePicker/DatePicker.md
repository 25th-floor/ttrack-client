DatePicker is used to navigate through

- The DatePicker will set his active class via uri

```jsx
const {Utils} = require('@data')
const moment = require('moment');
const {BrowserRouter} = require('react-router-dom');

// setup props
const activeMonth = moment('2017-10');
const user = {
    usr_email : "test@host.at",
    usr_employment_end : null,
    usr_employment_start : "2017-03-01T00:00:00.000Z",
    usr_firstname : "max",
    usr_id : 16,
    usr_lastname : "muster"
};
const year = Utils.getYearsForUser(user, Utils.getMomentToday());
const months = Utils.getMonthsForUser(user, activeMonth);

//DatePicker have a dependencies on the Router
<div style={{position:'relative', height:'100px'}} >
    <BrowserRouter>
        <DatePicker activeMonth={activeMonth} years={year} months={months} />
    </BrowserRouter>
</div>
```
