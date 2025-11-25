import { Hono } from 'hono';
import { eq } from 'drizzle-orm';
import { createDb, Env } from '../db';
import { settings } from '../db/schema';
import { authMiddleware } from '../middleware/auth';
import { sendNotification } from '../services/notifications/channels';

const app = new Hono<{ Bindings: Env; Variables: { user: any } }>();

app.use('*', authMiddleware);

app.get('/', async (c) => {
    const db = createDb(c.env.DB);
    const user = c.get('user');

    let userSettings = await db.select().from(settings).where(eq(settings.userId, user.id)).get();

    if (!userSettings) {
        // Create default if not exists
        const result = await db.insert(settings).values({
            userId: user.id,
            notificationConfig: '{}',
            preferences: '{}',
        }).returning();
        userSettings = result[0];
    }

    return c.json(userSettings);
});

app.post('/', async (c) => {
    const db = createDb(c.env.DB);
    const user = c.get('user');
    const body = await c.req.json();

    // Upsert
    const existing = await db.select().from(settings).where(eq(settings.userId, user.id)).get();

    if (existing) {
        const result = await db.update(settings)
            .set({
                notificationConfig: body.notificationConfig,
                preferences: body.preferences,
                updatedAt: new Date(),
            })
            .where(eq(settings.id, existing.id))
            .returning();
        return c.json(result[0]);
    } else {
        const result = await db.insert(settings).values({
            userId: user.id,
            notificationConfig: body.notificationConfig,
            preferences: body.preferences,
        }).returning();
        return c.json(result[0]);
    }
});

app.post('/test-notification', async (c) => {
    const { channel, config } = await c.req.json();
    const success = await sendNotification(channel, config, '测试通知', '这是一条来自订阅管理系统的测试消息。');
    return c.json({ success });
});

export default app;
