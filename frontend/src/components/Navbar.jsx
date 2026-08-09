import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { Shield, Bell, User, LogOut, Menu, X, Brain, PlusCircle, LayoutDashboard, BarChart3, AlertTriangle } from 'lucide-react';

export default function Navbar({ toggleSidebar, isSidebarOpen }) {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left: Brand & Mobile Menu Button */}
          <div className="flex items-center space-x-3">
            {user && (
              <button
                onClick={toggleSidebar}
                className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
              >
                {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            )}
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-indigo-300 tracking-tight">
                Campus <span className="text-indigo-400 font-extrabold">IQ</span>
              </span>
            </Link>
          </div>

          {/* Center Navigation Links (if logged in) */}
          {user && (
            <nav className="hidden md:flex items-center space-x-1">
              <Link
                to={user.role === 'ADMIN' ? '/admin' : '/dashboard'}
                className="px-3.5 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors flex items-center space-x-2"
              >
                <LayoutDashboard size={16} />
                <span>Dashboard</span>
              </Link>

              {user.role === 'STUDENT' && (
                <Link
                  to="/submit"
                  className="px-3.5 py-2 rounded-lg text-sm font-semibold text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 transition-colors flex items-center space-x-2"
                >
                  <PlusCircle size={16} />
                  <span>Submit Grievance</span>
                </Link>
              )}

              {user.role === 'ADMIN' && (
                <>
                  <Link
                    to="/admin/analytics"
                    className="px-3.5 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors flex items-center space-x-2"
                  >
                    <BarChart3 size={16} />
                    <span>Analytics</span>
                  </Link>
                  <Link
                    to="/admin/ai-insights"
                    className="px-3.5 py-2 rounded-lg text-sm font-medium text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 transition-colors flex items-center space-x-2"
                  >
                    <Brain size={16} />
                    <span>AI Insights</span>
                  </Link>
                </>
              )}
            </nav>
          )}

          {/* Right: Auth Profile & Notifications */}
          <div className="flex items-center space-x-3">
            {user ? (
              <>
                <Link
                  to="/notifications"
                  className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Notifications"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </Link>

                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center space-x-2 p-1.5 rounded-lg text-slate-300 hover:bg-slate-800 focus:outline-none transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-indigo-400 font-semibold text-sm">
                      {user.name.charAt(0)}
                    </div>
                    <span className="hidden sm:inline text-sm font-medium text-slate-200">{user.name}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-indigo-400 border border-slate-700">
                      {user.role}
                    </span>
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl py-1.5 z-50">
                      <div className="px-4 py-2 border-b border-slate-800">
                        <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                        <p className="text-xs text-slate-400 truncate">{user.email}</p>
                      </div>

                      <Link
                        to="/profile"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                      >
                        <User size={16} />
                        <span>Profile Settings</span>
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <LogOut size={16} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-md shadow-indigo-600/30 transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
