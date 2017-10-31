Basic Period:

```jsx
let period = {
    duration: 'period',
    per_id: 42,
    per_comment: 'Test Comment',
    per_start: { hours: 8 },
    per_stop: { hours: 18 },
    type: {
        pty_config: {
            icon: 'fa-question',
            bgcolor: 'green',
            color: 'black',
        },
        pty_name: 'my Title',
    },
};

<div>
    <Period periods={[period]} />
    <div style={{ clear: 'both' }} />
</div>
```
