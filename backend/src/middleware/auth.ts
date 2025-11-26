import { createMiddleware } from 'hono/factory';
import { verify } from 'hono/jwt';

export const authMiddleware = createMiddleware(async (c, next) => {
    const JWT_SECRET = c.env.JWT_SECRET || 'fallback-secret-change-in-prod';
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
