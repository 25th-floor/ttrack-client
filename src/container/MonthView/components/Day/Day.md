Basic Day:

```disable
const moment = require('moment');

let day = { date: moment() };
let activeMonth = moment();
let types = [{}];
let user = {};

<Day day={day} activeMonth={activeMonth} types={types} user={user} onSaveDay={() => {}} />
```
