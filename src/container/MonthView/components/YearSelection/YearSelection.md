Basic YearSelection:

```jsx
const moment = require('moment');
const {BrowserRouter} = require('react-router-dom');

<div>
    <BrowserRouter>
        <YearSelection activeMonth={moment()} years={[moment()]} />
    </BrowserRouter>
    <div style={{ clear: 'both' }} />
</div>
```
