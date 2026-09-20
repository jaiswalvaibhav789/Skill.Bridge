import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Lock, Mail, AlertCircle, ArrowRight, Eye, EyeOff, Sparkles, CheckCircle2 } from 'lucide-react';
import Button from '../components/common/Button';

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { toastSuccess, toastError } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { user, token } = await login({ email, password });
      if (onLoginSuccess) onLoginSuccess(token, user);
      toastSuccess(`Welcome back, ${user.email}!`);

      const role = (user.role || '').toLowerCase();
      if (role === 'student') navigate('/student');
      else if (role === 'industry') navigate('/industry');
      else if (role === 'faculty') navigate('/faculty');
      else if (role === 'institute' || role === 'admin') navigate('/institute');
      else navigate('/');
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please verify email and password.';
      setError(msg);
      toastError(msg);
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (demoEmail, demoPassword = 'Password@123') => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 sm:p-6 bg-slate-50">
      <div className="w-full max-w-md">
        
        {/* Main Login Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 sm:p-10">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold font-display text-slate-900 tracking-tight">
              Sign In
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Access the Academia–Industry Collaboration Platform
            </p>
          </div>

          {error && (
            <div className="mb-5 bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3.5 rounded-xl flex items-center gap-2.5">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="h-4 w-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student.ayush@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="h-4 w-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              isLoading={loading}
              variant="ayush"
              size="md"
              className="w-full mt-2"
            >
              Sign In to Platform <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </form>

          {/* 1-Click Quick Demo Profiles */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center mb-3">
              ⚡ 1-Click Demo Profiles (SIH & Evaluation)
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => fillDemo('student.ayush@gmail.com')}
                className="p-2.5 text-left rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-200/80 transition"
              >
                <span className="font-bold flex items-center gap-1.5 text-xs">
                  👨‍🎓 Student
                </span>
                <span className="text-[10px] text-emerald-700 truncate block mt-0.5">student.ayush@gmail.com</span>
              </button>

              <button
                type="button"
                onClick={() => fillDemo('careers@dabur.com')}
                className="p-2.5 text-left rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-200/80 transition"
              >
                <span className="font-bold flex items-center gap-1.5 text-xs">
                  🏢 Industry
                </span>
                <span className="text-[10px] text-amber-700 truncate block mt-0.5">careers@dabur.com</span>
              </button>

              <button
                type="button"
                onClick={() => fillDemo('dr.sharma@aiia.ac.in')}
                className="p-2.5 text-left rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-950 border border-indigo-200/80 transition"
              >
                <span className="font-bold flex items-center gap-1.5 text-xs">
                  👨‍🏫 Faculty
                </span>
                <span className="text-[10px] text-indigo-700 truncate block mt-0.5">dr.sharma@aiia.ac.in</span>
              </button>

              <button
                type="button"
                onClick={() => fillDemo('director@aiia.ac.in')}
                className="p-2.5 text-left rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-950 border border-sky-200/80 transition"
              >
                <span className="font-bold flex items-center gap-1.5 text-xs">
                  🏫 Institute
                </span>
                <span className="text-[10px] text-sky-700 truncate block mt-0.5">director@aiia.ac.in</span>
              </button>

              <button
                type="button"
                onClick={() => fillDemo('admin@ayush.gov.in')}
                className="col-span-2 p-2.5 text-left rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-950 border border-purple-200/80 transition"
              >
                <span className="font-bold flex items-center gap-1.5 text-xs">
                  🛡️ Ministry Overseer / Admin
                </span>
                <span className="text-[10px] text-purple-700 truncate block mt-0.5">admin@ayush.gov.in</span>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-emerald-600 hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
