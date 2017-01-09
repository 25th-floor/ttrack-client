// @flow

export type DBPeriodTypeConfig = {
    icon: string,
    bgcolor: string,
    color: string,
    nobadge: boolean,
    types: {
        period: boolean,
        fullday: boolean,
        halfday: boolean
    }
};

export type DBPeriodTypes = {
    pty_id: string,
    pty_name: string,
    pty_config: DBPeriodTypeConfig,
};