import { Hono } from 'hono';
import { sign, verify } from 'hono/jwt';
import { eq } from 'drizzle-orm';
import { createDb, Env } from '../db';
import { users } from '../db/schema';
import { hashPassword, verifyPassword } from '../utils/crypto';

const app = new Hono<{ Bindings: Env }>();

app.post('/setup', async (c) => {
    const db = createDb(c.env.DB);
    const JWT_SECRET = c.env.JWT_SECRET || 'fallback-secret-change-in-prod';
    const { username, password } = await c.req.json();

    const existingUsers = await db.select().from(users).limit(1);
    if (existingUsers.length > 0) {
        return c.json({ error: 'Setup already completed' }, 400);
    }

    const hashedPassword = await hashPassword(password);
    await db.insert(users).values({
        username,
        password: hashedPassword,
    });

    return c.json({ message: 'Setup successful' });
});

app.post('/login', async (c) => {
    const db = createDb(c.env.DB);
    const JWT_SECRET = c.env.JWT_SECRET || 'fallback-secret-change-in-prod';
    const { username, password } = await c.req.json();

    const user = await db.select().from(users).where(eq(users.username, username)).get();
    if (!user || !(await verifyPassword(password, user.password))) {
        return c.json({ error: 'Invalid credentials' }, 401);
    }

    const token = await sign({ id: user.id, username: user.username, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 }, JWT_SECRET);
    return c.json({ token });
});

app.get('/me', async (c) => {
    const JWT_SECRET = c.env.JWT_SECRET || 'fallback-secret-change-in-prod';
    const authHeader = c.req.header('Authorization');
    if (!authHeader) return c.json({ error: 'Unauthorized' }, 401);

    const token = authHeader.split(' ')[1];
    try {
        const payload = await verify(token, JWT_SECRET);
        return c.json({ user: payload });
    } catch (e) {
        return c.json({ error: 'Invalid token' }, 401);
    }
});

export default app;
