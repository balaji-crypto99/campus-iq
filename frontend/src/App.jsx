import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import GrievanceSubmit from './pages/GrievanceSubmit';
import GrievanceDetail from './pages/GrievanceDetail';
import AdminGrievances from './pages/AdminGrievances';
import AnalyticsPage from './pages/AnalyticsPage';
import AIInsightsPage from './pages/AIInsightsPage';
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';
import NotFound from './pages/NotFound';

function ProtectedRoute({ children, requiredRole }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={user.role === 'ADMIN' ? '/admin' : '/dashboard'} replace />;
  }
  return children;
}

export default function App() {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} isSidebarOpen={isSidebarOpen} />

      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {user && (
          <Sidebar isOpen={isSidebarOpen} closeSidebar={() => setIsSidebarOpen(false)} />
        )}

        <main className={`flex-1 ${user ? 'lg:pl-6' : ''} w-full overflow-hidden`}>
          <Routes>
            <Route path="/" element={user ? <Navigate to={user.role === 'ADMIN' ? '/admin' : '/dashboard'} replace /> : <Landing />} />
            <Route path="/login" element={user ? <Navigate to={user.role === 'ADMIN' ? '/admin' : '/dashboard'} replace /> : <Login />} />
            <Route path="/register" element={user ? <Navigate to={user.role === 'ADMIN' ? '/admin' : '/dashboard'} replace /> : <Register />} />

            {/* Student Routes */}
            <Route path="/dashboard" element={<ProtectedRoute requiredRole="STUDENT"><StudentDashboard /></ProtectedRoute>} />
            <Route path="/my-grievances" element={<ProtectedRoute requiredRole="STUDENT"><StudentDashboard /></ProtectedRoute>} />
            <Route path="/submit" element={<ProtectedRoute requiredRole="STUDENT"><GrievanceSubmit /></ProtectedRoute>} />

            {/* Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute requiredRole="ADMIN"><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/grievances" element={<ProtectedRoute requiredRole="ADMIN"><AdminGrievances /></ProtectedRoute>} />
            <Route path="/admin/analytics" element={<ProtectedRoute requiredRole="ADMIN"><AnalyticsPage /></ProtectedRoute>} />
            <Route path="/admin/ai-insights" element={<ProtectedRoute requiredRole="ADMIN"><AIInsightsPage /></ProtectedRoute>} />
            <Route path="/admin/hotspots" element={<ProtectedRoute requiredRole="ADMIN"><AIInsightsPage /></ProtectedRoute>} />

            {/* Shared Protected Routes */}
            <Route path="/grievances/:id" element={<ProtectedRoute><GrievanceDetail /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>

      <Footer />
    </div>
  );
}
