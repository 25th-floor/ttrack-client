import pg from 'pg';
import { keys, values, range } from 'ramda';

import dbConfigFile from './../../database.json';

export function getDatabasePool() {
    return new pg.Pool(dbConfigFile.dev);
}

const createDatabaseArguments = obj => ({
    keys: keys(obj),
    placeholder: range(1, keys(obj).length + 1).map(x => `$${x}`),
    values: values(obj),
});

async function createEntity(client, table, entity) {
    const arg = createDatabaseArguments(entity);
    const cols = arg.keys.join(',');
    const pl = arg.placeholder.join(',');
    const { rows } = await client.query(`INSERT INTO ${table} (${cols}) VALUES (${pl}) RETURNING *;`, arg.values);
    return rows[0];
}

export async function createUser(client, user) {
    return await createEntity(client, 'users', user);
}

export const PERIOD_TYPE_IDS = ['Balance', 'Comment', 'Holiday', 'Nursing', 'Sick', 'Vacation', 'Work'];
