// @flow

export type DBPeriodTypeConfig = {
    icon: string,           // font awesome icon name
    bgcolor: string,        // background color of the icon
    color: string,          // color of the icon
    nobadge?: boolean,      // ??
    types: {
        period: boolean,    // type period shows all period input fields
        fullday: boolean,   // allows option full day
        halfday: boolean,   // allows option half day
        duration: boolean   // allows just the duration field
    }
};

export type DBPeriodTypes = {
    pty_id: string,
    pty_name: string,
    pty_config: DBPeriodTypeConfig,
};
