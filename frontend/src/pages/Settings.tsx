import { useState, useEffect } from 'react';
import { Save, Send, Upload, Download } from 'lucide-react';

export default function Settings() {
    const [config, setConfig] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [testLoading, setTestLoading] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('/api/settings', {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                setConfig(JSON.parse(data.notificationConfig || '{}'));
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        const token = localStorage.getItem('token');
        try {
            await fetch('/api/settings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    notificationConfig: JSON.stringify(config),
                    preferences: '{}',
                }),
            });
            alert('保存成功');
        } catch (e) {
            alert('保存失败');
        }
    };

    const handleTest = async (channel: string) => {
        setTestLoading(true);
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('/api/settings/test-notification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    channel,
                    config: config[channel],
                }),
            });
            const data = await res.json();
            if (data.success) alert('发送成功');
            else alert('发送失败');
        } catch (e) {
            alert('发送出错');
        } finally {
            setTestLoading(false);
        }
    };

    const updateChannelConfig = (channel: string, key: string, value: any) => {
        setConfig({
            ...config,
            [channel]: {
                ...config[channel],
                [key]: value,
            },
        });
    };

    const renderChannelInput = (channel: string, label: string, fields: { key: string; label: string; type?: string }[]) => (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">{label}</h3>
                <div className="flex items-center space-x-2">
                    <label className="flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={config[channel]?.enabled || false}
                            onChange={(e) => updateChannelConfig(channel, 'enabled', e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                    <button
                        onClick={() => handleTest(channel)}
                        disabled={testLoading || !config[channel]?.enabled}
                        className="p-2 text-gray-400 hover:text-blue-600 disabled:opacity-50"
                        title="测试发送"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>

            {config[channel]?.enabled && (
                <div className="space-y-4">
                    {fields.map((field) => (
                        <div key={field.key}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                            <input
                                type={field.type || 'text'}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={config[channel]?.[field.key] || ''}
                                onChange={(e) => updateChannelConfig(channel, field.key, e.target.value)}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    const handleExport = async () => {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/backup/export', {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
    };

    const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const text = await file.text();
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('/api/backup/import', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: text,
            });
            if (res.ok) alert('恢复成功');
            else alert('恢复失败');
        } catch (e) {
            alert('恢复出错');
        }
    };

    if (loading) return <div>加载中...</div>;

    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">系统设置</h1>

            <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">通知渠道</h2>
                {renderChannelInput('telegram', 'Telegram Bot', [
                    { key: 'botToken', label: 'Bot Token' },
                    { key: 'chatId', label: 'Chat ID' },
                ])}
                {renderChannelInput('bark', 'Bark (iOS)', [
                    { key: 'key', label: 'Bark Key' },
                    { key: 'serverUrl', label: 'Server URL (Optional)' },
                ])}
                {renderChannelInput('wecom', '企业微信机器人', [
                    { key: 'key', label: 'Webhook Key' },
                ])}
                {renderChannelInput('webhook', 'Custom Webhook', [
                    { key: 'url', label: 'URL' },
                    { key: 'bodyTemplate', label: 'Body Template (JSON string, use {{title}}, {{message}})' },
                ])}
            </div>

            <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">数据备份</h2>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex space-x-4">
                    <button
                        onClick={handleExport}
                        className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                    >
                        <Download size={18} className="mr-2" />
                        导出备份
                    </button>
                    <label className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer">
                        <Upload size={18} className="mr-2" />
                        导入备份
                        <input type="file" className="hidden" accept=".json" onChange={handleImport} />
                    </label>
                </div>
            </div>

            <div className="mb-8 pt-8 border-t border-gray-200">
                <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                        <p>Subscription Manager v1.0.0</p>
                        <p>© 2024 Fan Jianhui. All rights reserved.</p>
                    </div>
                    <button
                        onClick={handleSave}
                        className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-200"
                    >
                        <Save size={20} className="mr-2" />
                        保存设置
                    </button>
                </div>
            </div>
        </div>
    );
}
