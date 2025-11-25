import { eq } from 'drizzle-orm';
import { createDb, Env } from '../db';
import { subscriptions, settings, notificationLogs } from '../db/schema';
import { calculateNextRenewal, getDaysRemaining } from '../utils/scheduler';
import { sendNotification } from './notifications/channels';

export async function checkSubscriptions(env: Env) {
    const db = createDb(env.DB);
    const allSubs = await db.select().from(subscriptions).where(eq(subscriptions.status, 'active')).all();

    for (const sub of allSubs) {
        const nextDate = calculateNextRenewal(sub);
        const days = getDaysRemaining(nextDate);

        // Check for reminder
        if (days === sub.remindDays) {
            await notifyUser(db, sub, days);
        }

        // Check for expiration/renewal
        if (days <= 0) {
            if (sub.autoRenew) {
                // Renew: Update startDate to nextDate (or keep original and just calculate next? 
                // Better to update startDate so we have a record of "current cycle")
                // Actually, if we update startDate, we lose the original start date. 
                // But for simple cycle management, moving the anchor forward is easiest.
                // Or we just keep adding cycles until > now.

                // Let's update startDate to the calculated nextDate.
                await db.update(subscriptions)
                    .set({ startDate: nextDate.toISOString().split('T')[0], updatedAt: new Date() })
                    .where(eq(subscriptions.id, sub.id));

                // Notify renewal? Maybe.
            } else {
                // Expire
                await db.update(subscriptions)
                    .set({ status: 'expired', updatedAt: new Date() })
                    .where(eq(subscriptions.id, sub.id));

                await notifyUser(db, sub, 0, '已过期');
            }
        }
    }
}

async function notifyUser(db: any, sub: any, days: number, statusText?: string) {
    // Get user settings
    const userSettings = await db.select().from(settings).where(eq(settings.userId, sub.userId)).get();
    if (!userSettings) return;

    const config = JSON.parse(userSettings.notificationConfig || '{}');
    const message = `订阅服务 "${sub.name}" ${statusText || `将于 ${days} 天后到期`}`;
    const title = '订阅提醒';

    // Send to all configured channels
    for (const [channel, channelConfig] of Object.entries(config)) {
        if (channelConfig && (channelConfig as any).enabled) {
            const success = await sendNotification(channel, channelConfig, title, message);

            // Log
            await db.insert(notificationLogs).values({
                subscriptionId: sub.id,
                channel,
                status: success ? 'success' : 'failed',
                message,
            });
        }
    }
}
