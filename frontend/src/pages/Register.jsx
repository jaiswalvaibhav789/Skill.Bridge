import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Mail, Lock, User, AlertCircle, ArrowRight, Sparkles, Building, GraduationCap, Briefcase, BookOpen } from 'lucide-react';
import Button from '../components/common/Button';

export default function Register({ onLoginSuccess }) {
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [degree, setDegree] = useState('BAMS');
  const [department, setDepartment] = useState('Dravyaguna');
  const [designation, setDesignation] = useState('Assistant Professor');
  const [companyName, setCompanyName] = useState('');
  const [industryType, setIndustryType] = useState('Pharmaceutical / GMP Unit');
  const [instituteName, setInstituteName] = useState('');
  const [aisheCode, setAisheCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const { toastSuccess, toastError } = useToast();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const profileData = {};
      if (role === 'student') {
        profileData.fullName = fullName;
        profileData.degree = degree;
      } else if (role === 'industry') {
        profileData.companyName = companyName || fullName;
        profileData.industryType = industryType;
      } else if (role === 'faculty') {
        profileData.fullName = fullName;
        profileData.department = department;
        profileData.designation = designation;
      } else if (role === 'institute') {
        profileData.instituteName = instituteName || fullName;
        profileData.aisheCode = aisheCode || `AISHE-${Date.now().toString().slice(-4)}`;
      }

      const { user, token } = await register({
        email,
        password,
        role,
        profileData
      });

      if (onLoginSuccess) onLoginSuccess(token, user);
      toastSuccess(`Account created successfully as ${role}!`);

      if (role === 'student') navigate('/student');
      else if (role === 'industry') navigate('/industry');
      else if (role === 'faculty') navigate('/faculty');
      else navigate('/institute');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please review your input.';
      setError(msg);
      toastError(msg);
    } finally {
      setLoading(false);
    }
  };

  const roleConfigs = [
    { id: 'student', label: 'Student', icon: GraduationCap, color: 'text-emerald-600' },
    { id: 'industry', label: 'Industry', icon: Briefcase, color: 'text-amber-600' },
    { id: 'faculty', label: 'Faculty', icon: BookOpen, color: 'text-indigo-600' },
    { id: 'institute', label: 'Institute', icon: Building, color: 'text-blue-600' }
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 sm:p-6 bg-slate-50">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-slate-200 p-8 sm:p-10">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold font-display text-slate-900 tracking-tight">Create Account</h2>
          <p className="text-xs text-slate-500 mt-1">Join the SkillBridge Enterprise Collaboration Portal</p>
        </div>

        {error && (
          <div className="mb-5 bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3.5 rounded-xl flex items-center gap-2.5">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Role Selector Grid */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Select Your Stakeholder Role</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {roleConfigs.map((r) => {
                const Icon = r.icon;
                const isSelected = role === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id)}
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 text-xs font-semibold transition ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isSelected ? 'text-emerald-400' : r.color}`} />
                    <span>{r.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Conditional Fields based on Role */}
          {role === 'student' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ayush Sharma"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Degree / Specialization</label>
                <select
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="BAMS">BAMS (Ayurvedic Medicine & Surgery)</option>
                  <option value="BHMS">BHMS (Homeopathic Medicine & Surgery)</option>
                  <option value="BUMS">BUMS (Unani Medicine & Surgery)</option>
                  <option value="BNYS">BNYS (Naturopathy & Yogic Sciences)</option>
                  <option value="BSMS">BSMS (Siddha Medicine & Surgery)</option>
                  <option value="MD/MS Ayush">MD/MS Ayush (Postgraduate)</option>
                  <option value="B.Pharma Ayush">B.Pharma Ayush</option>
                </select>
              </div>
            </>
          )}

          {role === 'industry' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Company / Hospital Name</label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Dabur Ayush Research & Manufacturing Ltd"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Industry Sector</label>
                <select
                  value={industryType}
                  onChange={(e) => setIndustryType(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="Pharmaceutical / GMP Unit">Pharmaceutical / GMP Manufacturing</option>
                  <option value="Ayush Hospital / Clinic">Ayush Hospital / Clinical Setup</option>
                  <option value="Wellness & Panchakarma Resort">Wellness & Panchakarma Resort</option>
                  <option value="Clinical Research Org (CRO)">Clinical Research Organization (CRO)</option>
                </select>
              </div>
            </>
          )}

          {role === 'faculty' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Full Name & Title</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Prof. (Dr.) Rajesh Sharma"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Department</label>
                  <input
                    type="text"
                    required
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="Dravyaguna / Kayachikitsa"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Designation</label>
                  <select
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="Assistant Professor">Assistant Professor</option>
                    <option value="Associate Professor">Associate Professor</option>
                    <option value="Professor">Professor</option>
                    <option value="Head of Department">Head of Department</option>
                    <option value="Dean">Dean</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {role === 'institute' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Institution / College Name</label>
                <input
                  type="text"
                  required
                  value={instituteName}
                  onChange={(e) => setInstituteName(e.target.value)}
                  placeholder="e.g. All India Institute of Ayurveda"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">AISHE / Accreditation Code</label>
                <input
                  type="text"
                  value={aisheCode}
                  onChange={(e) => setAisheCode(e.target.value)}
                  placeholder="e.g. C-54321"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </>
          )}

          {/* Common Email & Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Work / Academic Email</label>
            <div className="relative">
              <Mail className="h-4 w-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@organization.edu.in"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="h-4 w-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <Button
            type="submit"
            isLoading={loading}
            variant="ayush"
            size="md"
            className="w-full mt-2"
          >
            Create {role.toUpperCase()} Account <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500">
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-emerald-600 hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
