import { Hono } from 'hono';
import { eq, and } from 'drizzle-orm';
import { createDb, Env } from '../db';
import { subscriptions } from '../db/schema';
import { authMiddleware } from '../middleware/auth';

const app = new Hono<{ Bindings: Env; Variables: { user: any } }>();

app.use('*', authMiddleware);

app.get('/', async (c) => {
    const db = createDb(c.env.DB);
    const user = c.get('user');
    const subs = await db.select().from(subscriptions).where(eq(subscriptions.userId, user.id)).all();
    return c.json(subs);
});

app.post('/', async (c) => {
    const db = createDb(c.env.DB);
    const user = c.get('user');
    const body = await c.req.json();

    const result = await db.insert(subscriptions).values({
        ...body,
        userId: user.id,
    }).returning();

    return c.json(result[0]);
});

app.put('/:id', async (c) => {
    const db = createDb(c.env.DB);
    const user = c.get('user');
    const id = parseInt(c.req.param('id'));
    const body = await c.req.json();

    const result = await db.update(subscriptions)
        .set({ ...body, updatedAt: new Date() })
        .where(and(eq(subscriptions.id, id), eq(subscriptions.userId, user.id)))
        .returning();

    if (result.length === 0) {
        return c.json({ error: 'Subscription not found' }, 404);
    }

    return c.json(result[0]);
});

app.delete('/:id', async (c) => {
    const db = createDb(c.env.DB);
    const user = c.get('user');
    const id = parseInt(c.req.param('id'));

    const result = await db.delete(subscriptions)
        .where(and(eq(subscriptions.id, id), eq(subscriptions.userId, user.id)))
        .returning();

    if (result.length === 0) {
        return c.json({ error: 'Subscription not found' }, 404);
    }

    return c.json({ message: 'Deleted successfully' });
});

export default app;
