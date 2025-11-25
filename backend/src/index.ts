import { Hono } from 'hono'
import { cors } from 'hono/cors'

type Bindings = {
    DB: D1Database
    ASSETS: Fetcher
}

const app = new Hono<{ Bindings: Bindings }>()

app.use('/api/*', cors())

import authRoutes from './routes/auth';
import subscriptionRoutes from './routes/subscriptions';
import backupRoutes from './routes/backup';
import settingsRoutes from './routes/settings';

app.route('/api/auth', authRoutes);
app.route('/api/subscriptions', subscriptionRoutes);
app.route('/api/backup', backupRoutes);
app.route('/api/settings', settingsRoutes);

app.get('/api/health', (c) => {
    return c.json({ status: 'ok', message: 'Subscription Manager API is running' })
})

// Serve static assets (frontend) if not API
app.get('/*', async (c) => {
    return await c.env.ASSETS.fetch(c.req.raw)
})

import { checkSubscriptions } from './services/scheduler';

export default {
    fetch: app.fetch,
    async scheduled(event: ScheduledEvent, env: Bindings, ctx: ExecutionContext) {
        ctx.waitUntil(checkSubscriptions(env));
    },
}

export { app };
