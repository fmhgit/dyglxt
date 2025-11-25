import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Layout from './components/Layout';

function PrivateRoute({ children }: { children: React.ReactNode }) {
    const token = localStorage.getItem('token');
    return token ? <Layout>{children}</Layout> : <Navigate to="/login" />;
}

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                    path="/"
                    element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/settings"
                    element={
                        <PrivateRoute>
                            <Settings /> {/* Changed to use Settings component */}
                        </PrivateRoute>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;
