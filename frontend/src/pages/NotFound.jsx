import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { Compass, Home, ArrowLeft, ShieldAlert } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const getHomeRoute = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'student':
        return '/student';
      case 'industry':
        return '/industry';
      case 'faculty':
        return '/faculty';
      case 'institute':
      case 'admin':
        return '/institute';
      default:
        return '/';
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 sm:px-6">
      <Card className="max-w-md w-full p-8 text-center border-slate-200 shadow-lg">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-200">
          <Compass className="w-8 h-8 animate-spin-slow" />
        </div>

        <span className="text-xs font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          404 • Page Not Found
        </span>

        <h1 className="text-2xl font-black font-display text-slate-900 mt-3 mb-2">
          Destination Unmapped
        </h1>

        <p className="text-xs text-slate-500 leading-relaxed mb-6">
          The requested resource or route does not exist in the SkillBridge Ayush Portal navigation hierarchy.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full sm:w-auto text-xs gap-1.5"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Go Back</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-xs gap-1.5 shadow-xs"
            onClick={() => navigate(getHomeRoute())}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return to Dashboard</span>
          </Button>
        </div>
      </Card>
    </div>
  );
}
