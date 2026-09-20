import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NotificationDropdown from './navigation/NotificationDropdown';
import {
  Sparkles,
  LogOut,
  Bell,
  Menu,
  GraduationCap,
  Briefcase,
  Building2,
  BookOpen,
  Award
} from 'lucide-react';

export default function Navbar({ user, onLogout, onToggleSidebar }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate('/login');
  };

  const roleBadgeStyles = {
    student: 'bg-emerald-800 text-emerald-200 border-emerald-700',
    faculty: 'bg-indigo-800 text-indigo-200 border-indigo-700',
    industry: 'bg-amber-800 text-amber-200 border-amber-700',
    institute: 'bg-blue-800 text-blue-200 border-blue-700',
    admin: 'bg-rose-800 text-rose-200 border-rose-700',
  }[(user?.role || '').toLowerCase()] || 'bg-slate-800 text-slate-200';

  return (
    <nav className="bg-slate-900 text-white shadow-md sticky top-0 z-50 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Left: Mobile Toggle & Brand Logo */}
          <div className="flex items-center gap-3">
            {user && (
              <button
                onClick={onToggleSidebar}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden transition"
                aria-label="Toggle Navigation Sidebar"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            <Link to="/" className="flex items-center space-x-3 group">
              <div className="bg-emerald-500 p-2 rounded-xl text-slate-950 group-hover:scale-105 transition-transform shadow-xs">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <span className="font-bold text-lg tracking-tight text-white block leading-none font-display">
                  SkillBridge <span className="text-emerald-400">Enterprise</span>
                </span>
                <span className="text-[10px] text-slate-400 tracking-wider uppercase font-medium">
                  Academia–Industry Portal
                </span>
              </div>
            </Link>
          </div>

          {/* Right: User Actions / Public Links */}
          <div className="flex items-center space-x-3">
            {user ? (
              <>
                {/* Real-time Notification Center */}
                <NotificationDropdown user={user} />

                {/* User Info Capsule */}
                <div className="flex items-center pl-3 border-l border-slate-800 space-x-3">
                  <div className="text-right hidden sm:block">
                    <p className="font-semibold text-white text-xs truncate max-w-[140px] leading-tight">
                      {user.email}
                    </p>
                    <span className={`inline-block mt-0.5 capitalize text-[10px] font-bold px-2 py-0.5 rounded-md border ${roleBadgeStyles}`}>
                      {user.role}
                    </span>
                  </div>

                  {/* Sign Out Button */}
                  <button
                    onClick={handleLogout}
                    title="Sign Out"
                    className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-rose-600 hover:text-white transition"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl shadow-xs transition active:scale-[0.98]"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}
