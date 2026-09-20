import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCareerRoles, analyzeSkillGap } from '../services/api';
import { useToast } from '../context/ToastContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import {
  Compass,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  FileCheck2,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  GraduationCap
} from 'lucide-react';

export default function SkillGapExplorer() {
  const [careerRoles, setCareerRoles] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const [gapData, setGapData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  const { toastError, toastSuccess } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const rolesRes = await getCareerRoles();
      const roles = rolesRes.data?.data || rolesRes.data || [];
      setCareerRoles(roles);

      // Perform initial gap analysis on default or first role
      const initialRoleId = roles[0]?._id;
      if (initialRoleId) {
        setSelectedRoleId(initialRoleId);
        await performGapAnalysis(initialRoleId);
      }
    } catch (err) {
      toastError('Failed to load career benchmarks');
    } finally {
      setLoading(false);
    }
  };

  const performGapAnalysis = async (roleId) => {
    try {
      setAnalyzing(true);
      const res = await analyzeSkillGap(roleId);
      const data = res.data?.data || res.data;
      setGapData(data);
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to compute skill gap analysis');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleRoleChange = async (e) => {
    const roleId = e.target.value;
    setSelectedRoleId(roleId);
    await performGapAnalysis(roleId);
    toastSuccess('Skill gap recomputed for selected career role!');
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-slate-500">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="font-semibold text-sm">Computing Mathematical Skill Gap Vectors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Banner with Career Role Selector */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-emerald-950 rounded-3xl p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                Mathematical Gap Engine
              </span>
            </div>
            <h1 className="text-3xl font-bold font-display">Skill Gap Analyzer</h1>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              Compare your current verified diagnostic skills with industry career role requirements to identify and remediate deficits.
            </p>
          </div>

          {/* Role Dropdown Selector */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 min-w-[280px]">
            <label className="block text-xs font-semibold text-emerald-300 mb-1.5 uppercase tracking-wider">
              Target Career Benchmark
            </label>
            <select
              value={selectedRoleId}
              onChange={handleRoleChange}
              disabled={analyzing}
              className="w-full px-3.5 py-2.5 bg-slate-900/90 text-white border border-slate-700 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-400"
            >
              {careerRoles.map((r) => (
                <option key={r._id} value={r._id}>
                  {r.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {gapData && (
        <>
          {/* Key Metrics Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Overall Readiness Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xl font-display flex-shrink-0">
                {gapData.roleReadinessPercentage}%
              </div>
              <div>
                <span className="text-xs font-medium text-slate-500 block">Overall Role Readiness</span>
                <span className="text-base font-bold font-display text-slate-900">
                  {gapData.roleReadinessPercentage >= 75 ? 'Industry Ready' : 'Training Required'}
                </span>
              </div>
            </div>

            {/* Critical Deficits */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-xl font-display flex-shrink-0">
                {gapData.summary?.criticalGapsCount || 0}
              </div>
              <div>
                <span className="text-xs font-medium text-slate-500 block">Critical Gaps (≥ 30%)</span>
                <span className="text-base font-bold font-display text-rose-700">Immediate Action</span>
              </div>
            </div>

            {/* High Gaps */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xl font-display flex-shrink-0">
                {gapData.summary?.highGapsCount || 0}
              </div>
              <div>
                <span className="text-xs font-medium text-slate-500 block">High Gaps (20% - 29%)</span>
                <span className="text-base font-bold font-display text-amber-700">Workshop Priority</span>
              </div>
            </div>

            {/* Satisfactory Competencies */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xl font-display flex-shrink-0">
                {gapData.summary?.satisfactoryCount || 0}
              </div>
              <div>
                <span className="text-xs font-medium text-slate-500 block">Satisfactory Skills</span>
                <span className="text-base font-bold font-display text-indigo-700">Benchmarks Met</span>
              </div>
            </div>
          </div>

          {/* Granular Skill Comparison Breakdown */}
          <Card
            title={`Required Skill Deficit Breakdown — ${gapData.careerRole?.title}`}
            subtitle="Calculated as: Deficit = Required Benchmark - Current Verified Proficiency"
            icon={Compass}
          >
            <div className="space-y-4">
              {gapData.gapDetails?.map((item, idx) => {
                const criticalityColors = {
                  Critical: 'border-rose-200 bg-rose-50/40 text-rose-700',
                  High: 'border-amber-200 bg-amber-50/40 text-amber-700',
                  Medium: 'border-yellow-200 bg-yellow-50/30 text-yellow-800',
                  Low: 'border-slate-200 bg-slate-50 text-slate-700',
                  Satisfactory: 'border-emerald-200 bg-emerald-50/40 text-emerald-800'
                }[item.criticality] || 'border-slate-200 text-slate-700';

                return (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-slate-900">{item.skillName}</h4>
                          <span className="text-[10px] text-slate-500 px-2 py-0.5 rounded-md bg-slate-100 font-medium">
                            {item.category}
                          </span>
                        </div>
                        <span className="text-xs text-slate-500 block mt-0.5">
                          Current Score: <strong className="text-slate-800">{item.currentScore}%</strong> • Target Threshold: <strong className="text-slate-800">{item.targetScore}%</strong>
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full border ${criticalityColors}`}>
                          {item.criticality === 'Satisfactory' ? 'Benchmark Satisfied' : `${item.criticality} Deficit: -${item.gapPercentage}%`}
                        </span>
                        {item.gapPercentage > 0 && (
                          <Button
                            size="sm"
                            variant="outline"
                            icon={FileCheck2}
                            onClick={() => navigate('/assessments')}
                          >
                            Take Quiz
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Progress Comparison Bar */}
                    <div className="space-y-1">
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden relative">
                        {/* Target Marker */}
                        <div
                          className="absolute top-0 bottom-0 w-0.5 bg-slate-900 z-10"
                          style={{ left: `${item.targetScore}%` }}
                          title={`Target: ${item.targetScore}%`}
                        />
                        {/* Current Score Bar */}
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            item.currentScore >= item.targetScore ? 'bg-emerald-500' : 'bg-amber-500'
                          }`}
                          style={{ width: `${item.currentScore}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                        <span>0%</span>
                        <span>Target: {item.targetScore}%</span>
                        <span>100%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Targeted Upskilling & Learning Program Recommendations */}
          <Card
            title="Recommended Upskilling Pathways"
            subtitle="Courses and hands-on modules targeted at closing your identified skill deficits"
            icon={BookOpen}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {gapData.recommendedPrograms?.length > 0 ? (
                gapData.recommendedPrograms.map((prog) => (
                  <div
                    key={prog._id}
                    className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-xs transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="verified">{prog.type}</Badge>
                        <span className="text-xs text-slate-500 font-medium">{prog.durationHours} Hours</span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-900">{prog.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Offered by {prog.providerName}</p>
                      <p className="text-xs text-slate-600 mt-2 line-clamp-2">{prog.description}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                      <span className="text-xs font-semibold text-emerald-700">{prog.cost}</span>
                      <Button
                        size="sm"
                        variant="ayush"
                        icon={ArrowRight}
                        onClick={() => navigate('/learning')}
                      >
                        Enroll Course
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 p-6 text-center text-slate-500 text-xs italic">
                  No active learning programs found for these specific skill tags.
                </div>
              )}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
