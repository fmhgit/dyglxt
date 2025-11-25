import { createMiddleware } from 'hono/factory';
import { verify } from 'hono/jwt';

const JWT_SECRET = 'your-secret-key-change-this'; // In prod, use env var

export const authMiddleware = createMiddleware(async (c, next) => {
    const authHeader = c.req.header('Authorization');
    if (!authHeader) {
        return c.json({ error: 'Unauthorized' }, 401);
    }

    const token = authHeader.split(' ')[1];
    try {
        const payload = await verify(token, JWT_SECRET);
        c.set('user', payload);
        await next();
    } catch (e) {
        return c.json({ error: 'Invalid token' }, 401);
    }
});
