export interface NotificationChannel {
    send(config: any, title: string, message: string): Promise<boolean>;
}

export class TelegramChannel implements NotificationChannel {
    async send(config: any, title: string, message: string): Promise<boolean> {
        const { botToken, chatId } = config;
        if (!botToken || !chatId) return false;

        const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
        const body = {
            chat_id: chatId,
            text: `*${title}*\n\n${message}`,
            parse_mode: 'Markdown',
        };

        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            return res.ok;
        } catch (e) {
            console.error('Telegram send failed', e);
            return false;
        }
    }
}

export class BarkChannel implements NotificationChannel {
    async send(config: any, title: string, message: string): Promise<boolean> {
        const { key, serverUrl } = config; // serverUrl optional
        if (!key) return false;

        const baseUrl = serverUrl || 'https://api.day.app';
        const url = `${baseUrl}/${key}/${encodeURIComponent(title)}/${encodeURIComponent(message)}`;

        try {
            const res = await fetch(url);
            return res.ok;
        } catch (e) {
            console.error('Bark send failed', e);
            return false;
        }
    }
}

export class WebhookChannel implements NotificationChannel {
    async send(config: any, title: string, message: string): Promise<boolean> {
        const { url, method = 'POST', headers = {}, bodyTemplate } = config;
        if (!url) return false;

        let body = bodyTemplate
            ? bodyTemplate.replace('{{title}}', title).replace('{{message}}', message)
            : JSON.stringify({ title, message });

        // If bodyTemplate is not provided, we default to JSON. 
        // If it IS provided, it might be a string that needs parsing if the content-type is json, 
        // but usually we just send it as string body.

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', ...headers },
                body,
            });
            return res.ok;
        } catch (e) {
            console.error('Webhook send failed', e);
            return false;
        }
    }
}

export class WeComBotChannel implements NotificationChannel {
    async send(config: any, title: string, message: string): Promise<boolean> {
        const { key } = config;
        if (!key) return false;

        const url = `https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=${key}`;
        const body = {
            msgtype: 'markdown',
            markdown: {
                content: `## ${title}\n${message}`,
            },
        };

        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            return res.ok;
        } catch (e) {
            console.error('WeCom send failed', e);
            return false;
        }
    }
}

export class ResendChannel implements NotificationChannel {
    async send(config: any, title: string, message: string): Promise<boolean> {
        const { apiKey, from, to } = config;
        if (!apiKey || !from || !to) return false;

        const url = 'https://api.resend.com/emails';
        const body = {
            from,
            to,
            subject: title,
            html: `<p>${message.replace(/\n/g, '<br>')}</p>`,
        };

        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });
            return res.ok;
        } catch (e) {
            console.error('Resend send failed', e);
            return false;
        }
    }
}

export const channels: Record<string, NotificationChannel> = {
    telegram: new TelegramChannel(),
    bark: new BarkChannel(),
    webhook: new WebhookChannel(),
    wecom: new WeComBotChannel(),
    resend: new ResendChannel(),
};

export async function sendNotification(channelName: string, config: any, title: string, message: string) {
    const channel = channels[channelName];
    if (!channel) {
        console.warn(`Channel ${channelName} not found`);
        return false;
    }
    return await channel.send(config, title, message);
}
