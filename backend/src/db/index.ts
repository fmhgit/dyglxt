import { drizzle } from 'drizzle-orm/d1';
import { drizzle as drizzleSqlite } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';

export type Env = {
    DB: D1Database | any; // Support both D1 and SQLite
};

export const createDb = (db: any) => {
    if (db.prepare) {
        // better-sqlite3 instance
        return drizzleSqlite(db, { schema });
    }
    // D1 instance
    return drizzle(db, { schema });
};
