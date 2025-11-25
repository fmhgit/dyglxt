import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import SubscriptionCard from '../components/SubscriptionCard';
import SubscriptionModal from '../components/SubscriptionModal';

export default function Dashboard() {
    const [subs, setSubs] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSub, setEditingSub] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchSubs = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/subscriptions', {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                setSubs(data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubs();
    }, []);

    const handleSave = async (data: any) => {
        const token = localStorage.getItem('token');
        const url = editingSub ? `/api/subscriptions/${(editingSub as any).id}` : '/api/subscriptions';
        const method = editingSub ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                fetchSubs();
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('确定要删除吗？')) return;

        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`/api/subscriptions/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (res.ok) {
                fetchSubs();
            }
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900">我的订阅</h1>
                <button
                    onClick={() => {
                        setEditingSub(null);
                        setIsModalOpen(true);
                    }}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                    <Plus size={20} className="mr-2" />
                    新增订阅
                </button>
            </div>

            {loading ? (
                <div className="text-center py-12 text-gray-500">加载中...</div>
            ) : subs.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                    <p className="text-gray-500 mb-4">暂无订阅</p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="text-blue-600 hover:underline"
                    >
                        添加第一个订阅
                    </button>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {subs.map((sub: any) => (
                        <SubscriptionCard
                            key={sub.id}
                            sub={sub}
                            onEdit={(s) => {
                                setEditingSub(s as any);
                                setIsModalOpen(true);
                            }}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}

            <SubscriptionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                initialData={editingSub}
            />
        </div>
    );
}
