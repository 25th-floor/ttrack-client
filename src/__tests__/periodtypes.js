export default [
    {
        pty_id: 'Work',
        pty_name: 'Arbeitszeit',
        pty_config: {
            icon: 'fa-comment',
            bgcolor: '#656D78',
            color: 'white',
            nobadge: true,
            types: {
                period: true,
                fullday: true,
                halfday: true,
            },
        },
    },
    {
        pty_id: 'Vacation',
        pty_name: 'Urlaub',
        pty_config: {
            icon: 'fa-car',
            bgcolor: '#A0D468',
            color: 'white',
            types: {
                period: false,
                fullday: true,
                halfday: true,
            },
        },
    },
    {
        pty_id: 'Sick',
        pty_name: 'Krankenstand',
        pty_config: {
            icon: 'fa-bed',
            bgcolor: '#ED5565',
            color: 'white',
            types: {
                period: false,
                fullday: true,
                halfday: false,
            },
        },
    },
    {
        pty_id: 'Nursing',
        pty_name: 'Pflegeurlaub',
        pty_config: {
            icon: 'fa-heartbeat',
            bgcolor: '#FC6E51',
            color: 'white',
            types: {
                period: false,
                fullday: true,
                halfday: true,
            },
        },
    },
    {
        pty_id: 'Holiday',
        pty_name: 'Feiertag',
        pty_config: {
            icon: 'fa-calendar',
            bgcolor: '#AC92EC',
            color: 'white',
            types: {
                period: false,
                fullday: true,
                halfday: true,
            },
        },
    },
    {
        pty_id: 'Comment',
        pty_name: 'Kommentar',
        pty_config: {
            icon: 'fa-comment',
            bgcolor: '#656D78',
            color: 'white',
            types: {
                period: false,
                fullday: false,
                halfday: false,
            },
        },
    },
    {
        pty_id: 'Balance',
        pty_name: 'Ausgleich',
        pty_config: {
            icon: 'fa-balance-scale',
            bgcolor: '#d9bb4f',
            color: 'white',
            types: {
                period: false,
                fullday: false,
                halfday: false,
                duration: true,
            },
        },
    },
];
