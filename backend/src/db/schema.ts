import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const users = sqliteTable('users', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    username: text('username').notNull().unique(),
    password: text('password').notNull(), // Hashed password
    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

export const subscriptions = sqliteTable('subscriptions', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: integer('user_id').references(() => users.id),
    name: text('name').notNull(),
    price: real('price').default(0),
    currency: text('currency').default('CNY'),
    startDate: text('start_date').notNull(), // ISO date string YYYY-MM-DD
    cycleValue: integer('cycle_value').default(1),
    cycleUnit: text('cycle_unit').default('month'), // day, month, year
    isLunar: integer('is_lunar', { mode: 'boolean' }).default(false),
    remindDays: integer('remind_days').default(3),
    autoRenew: integer('auto_renew', { mode: 'boolean' }).default(true),
    status: text('status').default('active'), // active, inactive, expired
    remark: text('remark'),
    category: text('category').default('other'),
    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

export const settings = sqliteTable('settings', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: integer('user_id').references(() => users.id).unique(),
    // JSON string for notification configs
    notificationConfig: text('notification_config').default('{}'),
    // JSON string for other preferences (e.g. lunar display)
    preferences: text('preferences').default('{}'),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

export const notificationLogs = sqliteTable('notification_logs', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    subscriptionId: integer('subscription_id').references(() => subscriptions.id),
    channel: text('channel').notNull(), // telegram, email, etc.
    status: text('status').notNull(), // success, failed
    message: text('message'),
    sentAt: integer('sent_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});
