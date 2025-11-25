import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => Promise<void>;
    initialData?: any;
}

export default function SubscriptionModal({ isOpen, onClose, onSave, initialData }: Props) {
    const [formData, setFormData] = useState({
        name: '',
        price: 0,
        currency: 'CNY',
        startDate: new Date().toISOString().split('T')[0],
        cycleValue: 1,
        cycleUnit: 'month', // day, month, year
        isLunar: false,
        remindDays: 3,
        autoRenew: true,
        remark: '',
        category: 'other',
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            // Reset
            setFormData({
                name: '',
                price: 0,
                currency: 'CNY',
                startDate: new Date().toISOString().split('T')[0],
                cycleValue: 1,
                cycleUnit: 'month',
                isLunar: false,
                remindDays: 3,
                autoRenew: true,
                remark: '',
                category: 'other',
            });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSave(formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">
                        {initialData ? '编辑订阅' : '新增订阅'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">名称</label>
                        <input
                            type="text"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">价格</label>
                            <input
                                type="number"
                                step="0.01"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">货币</label>
                            <select
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={formData.currency}
                                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                            >
                                <option value="CNY">CNY</option>
                                <option value="USD">USD</option>
                                <option value="EUR">EUR</option>
                                <option value="HKD">HKD</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">开始日期</label>
                            <input
                                type="date"
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                            />
                        </div>
                        <div className="flex items-center pt-6">
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                    checked={formData.isLunar}
                                    onChange={(e) => setFormData({ ...formData, isLunar: e.target.checked })}
                                />
                                <span className="text-sm text-gray-700">农历日期</span>
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">周期</label>
                        <div className="flex space-x-2">
                            <input
                                type="number"
                                min="1"
                                className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={formData.cycleValue}
                                onChange={(e) => setFormData({ ...formData, cycleValue: parseInt(e.target.value) })}
                            />
                            <select
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={formData.cycleUnit}
                                onChange={(e) => setFormData({ ...formData, cycleUnit: e.target.value })}
                            >
                                <option value="day">天</option>
                                <option value="month">月</option>
                                <option value="year">年</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">提前提醒 (天)</label>
                        <input
                            type="number"
                            min="0"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={formData.remindDays}
                            onChange={(e) => setFormData({ ...formData, remindDays: parseInt(e.target.value) })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">备注</label>
                        <textarea
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={3}
                            value={formData.remark}
                            onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
                        />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                        >
                            取消
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                        >
                            保存
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
