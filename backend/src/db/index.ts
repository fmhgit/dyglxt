import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';

export type Env = {
    DB: D1Database;
};

export const createDb = (db: D1Database) => {
    return drizzle(db, { schema });
};
