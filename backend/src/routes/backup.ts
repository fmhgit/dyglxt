import { Hono } from 'hono';
import { createDb, Env } from '../db';
import { users, subscriptions, settings, notificationLogs } from '../db/schema';
import { authMiddleware } from '../middleware/auth';
import { sql } from 'drizzle-orm';

const app = new Hono<{ Bindings: Env; Variables: { user: any } }>();

app.use('*', authMiddleware);

app.get('/export', async (c) => {
    const db = createDb(c.env.DB);

    // Fetch all data
    // Note: For security, maybe exclude password hashes or keep them if moving to same system?
    // If moving to new system, we need passwords.

    const allUsers = await db.select().from(users).all();
    const allSubs = await db.select().from(subscriptions).all();
    const allSettings = await db.select().from(settings).all();
    const allLogs = await db.select().from(notificationLogs).all();

    const backupData = {
        version: 1,
        timestamp: new Date().toISOString(),
        users: allUsers,
        subscriptions: allSubs,
        settings: allSettings,
        notificationLogs: allLogs,
    };

    return c.json(backupData);
});

app.post('/import', async (c) => {
    const db = createDb(c.env.DB);
    const data = await c.req.json();

    if (!data.version || !data.users) {
        return c.json({ error: 'Invalid backup format' }, 400);
    }

    // Transactional restore
    // D1 doesn't support explicit transactions in the same way as standard SQL sometimes via HTTP, 
    // but Drizzle batch/transaction might work.
    // For now, we'll do sequential deletes and inserts.

    try {
        // 1. Clear existing data (Optional: based on query param ?mode=overwrite)
        // For now, assume overwrite for full restore.

        // We need to be careful about foreign keys. Delete children first.
        await db.delete(notificationLogs).run();
        await db.delete(settings).run();
        await db.delete(subscriptions).run();
        await db.delete(users).run();

        // 2. Insert new data
        if (data.users.length) await db.insert(users).values(data.users).run();
        if (data.subscriptions.length) await db.insert(subscriptions).values(data.subscriptions).run();
        if (data.settings.length) await db.insert(settings).values(data.settings).run();
        if (data.notificationLogs.length) await db.insert(notificationLogs).values(data.notificationLogs).run();

        return c.json({ message: 'Restore successful' });
    } catch (e) {
        console.error(e);
        return c.json({ error: 'Restore failed' }, 500);
    }
});

export default app;
