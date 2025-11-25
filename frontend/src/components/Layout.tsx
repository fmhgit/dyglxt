import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Calendar, Settings, LogOut, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const navItems = [
        { path: '/', icon: Calendar, label: '订阅列表' },
        { path: '/settings', icon: Settings, label: '设置' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
            {/* Top Navigation (Desktop) */}
            {!isMobile && (
                <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex items-center">
                                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                    订阅管理
                                </span>
                            </div>
                            <div className="flex items-center space-x-4">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === item.path
                                                ? 'text-blue-600 bg-blue-50'
                                                : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <item.icon size={18} />
                                            <span>{item.label}</span>
                                        </div>
                                    </Link>
                                ))}
                                <button
                                    onClick={handleLogout}
                                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                    title="退出登录"
                                >
                                    <LogOut size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>
            )}

            {/* Main Content */}
            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
                {children}
            </main>

            {/* Bottom Navigation (Mobile) */}
            {isMobile && (
                <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe z-50">
                    <div className="flex justify-around items-center h-16">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${location.pathname === item.path ? 'text-blue-600' : 'text-gray-500'
                                    }`}
                            >
                                <item.icon size={24} />
                                <span className="text-xs">{item.label}</span>
                            </Link>
                        ))}
                        <button
                            onClick={handleLogout}
                            className="flex flex-col items-center justify-center w-full h-full space-y-1 text-gray-500 hover:text-red-600"
                        >
                            <LogOut size={24} />
                            <span className="text-xs">退出</span>
                        </button>
                    </div>
                </nav>
            )}
        </div>
    );
}
