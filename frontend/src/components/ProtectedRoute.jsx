import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert } from 'lucide-react';

export default function ProtectedRoute({ children, allowedRoles = [], user: propUser }) {
  const { user: contextUser, loading } = useAuth();
  const activeUser = propUser || contextUser;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500">
        <p className="font-semibold text-sm">Verifying session credentials...</p>
      </div>
    );
  }

  if (!activeUser) {
    return <Navigate to="/login" replace />;
  }

  const userRole = (activeUser.role || '').toLowerCase();
  const normalizedAllowed = allowedRoles.map(r => r.toLowerCase());

  if (normalizedAllowed.length > 0 && !normalizedAllowed.includes(userRole) && userRole !== 'admin') {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-6 bg-slate-50">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 border border-slate-200 shadow-elevated text-center">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold font-display text-slate-900 mb-2">
            Access Restricted
          </h2>
          <p className="text-sm text-slate-600 mb-6">
            Your current role (<span className="capitalize font-semibold text-slate-900">{activeUser.role}</span>) does not have permission to view this view.
          </p>
          <a
            href="/"
            className="inline-flex items-center justify-center px-4 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-semibold hover:bg-brand-700 transition"
          >
            Return to Home
          </a>
        </div>
      </div>
    );
  }

  return children;
}
