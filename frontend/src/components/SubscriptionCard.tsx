import { Edit2, Trash2, Calendar, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';

interface Subscription {
    id: number;
    name: string;
    price: number;
    currency: string;
    startDate: string;
    cycleValue: number;
    cycleUnit: string;
    isLunar: boolean;
    remindDays: number;
    autoRenew: boolean;
    status: string;
    remark?: string;
}

interface Props {
    sub: Subscription;
    onEdit: (sub: Subscription) => void;
    onDelete: (id: number) => void;
}

export default function SubscriptionCard({ sub, onEdit, onDelete }: Props) {
    // We need to calculate next renewal here or receive it from backend.
    // Ideally backend sends it, but for now let's calculate or assume backend sends 'nextRenewal'
    // Since our backend schema doesn't store 'nextRenewal' explicitly (it calculates it), 
    // we should probably calculate it in frontend too or add a field to API response.
    // Let's assume we calculate it in frontend for now to keep UI responsive.

    // Simplified calculation for display (real logic should match backend)
    const nextDate = new Date(sub.startDate); // Placeholder
    const daysRemaining = 30; // Placeholder

    const statusColors = {
        active: 'bg-green-100 text-green-800',
        expired: 'bg-red-100 text-red-800',
        inactive: 'bg-gray-100 text-gray-800',
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow p-5">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">{sub.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{sub.remark}</p>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${(statusColors as any)[sub.status] || statusColors.active}`}>
                    {sub.status === 'active' ? '生效中' : sub.status === 'expired' ? '已过期' : '已停用'}
                </span>
            </div>

            <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                    <span className="text-2xl font-bold text-gray-900 mr-1">{sub.price}</span>
                    <span className="text-sm">{sub.currency}</span>
                    <span className="text-gray-400 mx-2">/</span>
                    <span className="text-sm">
                        {sub.cycleValue} {sub.cycleUnit === 'year' ? '年' : sub.cycleUnit === 'month' ? '月' : '日'}
                    </span>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 pt-2 border-t border-gray-50">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center" title="下次续费">
                            <Calendar size={14} className="mr-1" />
                            <span>{format(nextDate, 'yyyy-MM-dd')}</span>
                        </div>
                        <div className="flex items-center" title="剩余天数">
                            <RefreshCw size={14} className="mr-1" />
                            <span className={daysRemaining <= 7 ? 'text-orange-500 font-medium' : ''}>
                                {daysRemaining} 天
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-gray-50">
                <button
                    onClick={() => onEdit(sub)}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-full hover:bg-blue-50"
                >
                    <Edit2 size={16} />
                </button>
                <button
                    onClick={() => onDelete(sub.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-full hover:bg-red-50"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );
}
