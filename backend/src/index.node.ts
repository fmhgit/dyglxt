import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { app } from './index';
import DatabaseConstructor from 'better-sqlite3';
import * as fs from 'fs';
import * as path from 'path';

const port = parseInt(process.env.PORT || '3000');
const dbPath = process.env.DB_PATH || 'sqlite.db';

// Ensure DB directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

const sqlite = new DatabaseConstructor(dbPath);

// Middleware to inject DB into env
app.use('*', async (c, next) => {
    c.env = {
        ...c.env,
        DB: sqlite,
    };
    await next();
});

// Serve static frontend files
app.use('/*', serveStatic({
    root: './frontend/dist',
    rewriteRequestPath: (path) => path === '/' ? '/index.html' : path,
}));

// Fallback for SPA routing
app.use('*', serveStatic({
    path: './frontend/dist/index.html',
}));

console.log(`Server is running on port ${port}`);

serve({
    fetch: app.fetch,
    port,
});
