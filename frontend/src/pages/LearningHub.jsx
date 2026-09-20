import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getLearningPrograms,
  getRecommendedLearningPrograms,
  getMyEnrolledPrograms,
  enrollLearningProgram,
  updateLearningProgress
} from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import {
  BookOpen,
  GraduationCap,
  Sparkles,
  Search,
  Filter,
  Clock,
  Award,
  CheckCircle2,
  AlertCircle,
  Building2,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Star,
  PlayCircle,
  ShieldCheck,
  Zap,
  BookmarkCheck
} from 'lucide-react';

export default function LearningHub() {
  const { user } = useAuth();
  const { toastSuccess, toastError, toastInfo } = useToast();
  const navigate = useNavigate();

  // State
  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog' | 'recommended' | 'enrolled'
  const [programs, setPrograms] = useState([]);
  const [recommendedPrograms, setRecommendedPrograms] = useState([]);
  const [myEnrollments, setMyEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedProvider, setSelectedProvider] = useState('All');

  // Modal State
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // 1. Fetch catalog
      const catalogRes = await getLearningPrograms();
      const allList = catalogRes.data?.data || catalogRes.data || [];
      setPrograms(allList);

      // 2. Fetch authenticated student data if applicable
      if (user && user.role === 'student') {
        try {
          const [recRes, enrollRes] = await Promise.all([
            getRecommendedLearningPrograms(),
            getMyEnrolledPrograms()
          ]);
          setRecommendedPrograms(recRes.data?.data || recRes.data || []);
          setMyEnrollments(enrollRes.data?.data || enrollRes.data || []);
        } catch (subErr) {
          console.warn('Could not load student-specific learning data:', subErr);
        }
      }
    } catch (err) {
      console.error('Error fetching learning catalog:', err);
      toastError('Failed to load learning programs');
    } finally {
      setLoading(false);
    }
  };

  // Handle Enrollment
  const handleEnroll = async (program) => {
    if (!user) {
      toastInfo('Please sign in as a student to enroll in programs');
      navigate('/login');
      return;
    }

    if (user.role !== 'student') {
      toastInfo('Only student profiles can enroll in accredited student courses');
      return;
    }

    setEnrollingId(program._id);
    try {
      await enrollLearningProgram(program._id);
      toastSuccess(`Successfully enrolled in "${program.title}"!`);

      // Refresh enrollments and catalog
      const enrollRes = await getMyEnrolledPrograms();
      setMyEnrollments(enrollRes.data?.data || enrollRes.data || []);
      
      // Update local program count
      setPrograms(prev => prev.map(p => 
        p._id === program._id 
          ? { ...p, enrolledStudentsCount: (p.enrolledStudentsCount || 0) + 1 }
          : p
      ));

      if (isModalOpen) {
        setIsModalOpen(false);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Enrollment failed';
      toastError(msg);
    } finally {
      setEnrollingId(null);
    }
  };

  // Handle Progress Boost (Simulation)
  const handleSimulateStudy = async (programId) => {
    setUpdatingId(programId);
    try {
      const res = await updateLearningProgress(programId, { progressDelta: 25 });
      const updated = res.data?.data;
      
      if (updated?.status === 'Completed') {
        toastSuccess('🎉 Course 100% Completed! Verifiable Ayush Credential Generated.');
      } else {
        toastSuccess(`Study session logged! Progress: ${updated?.progressPercentage}%`);
      }

      // Refresh enrollments
      const enrollRes = await getMyEnrolledPrograms();
      setMyEnrollments(enrollRes.data?.data || enrollRes.data || []);
    } catch (err) {
      toastError('Failed to record learning progress');
    } finally {
      setUpdatingId(null);
    }
  };

  // Helper to check if already enrolled
  const getEnrollmentForProgram = (programId) => {
    return myEnrollments.find(e => (e.program?._id || e.program) === programId);
  };

  // Filtered Programs
  const filteredPrograms = programs.filter(p => {
    const matchesSearch = 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.providerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.coveredSkills || []).some(s => s.name?.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType = selectedType === 'All' || p.type === selectedType;
    const matchesDiff = selectedDifficulty === 'All' || p.difficulty === selectedDifficulty;
    const matchesProv = selectedProvider === 'All' || p.providerType === selectedProvider;

    return matchesSearch && matchesType && matchesDiff && matchesProv;
  });

  const openProgramModal = (program) => {
    setSelectedProgram(program);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-700/60 relative overflow-hidden">
        <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-4 border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>National Ayush Skill Remediation Ecosystem</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display mb-3 text-white">
            Learning & Skill Development Programs
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
            Bridge targeted skill gaps identified in your diagnostic assessments. Explore accredited masterclasses,
            Schedule T ASU drug GMP certifications, chromatography workshops, and faculty development programs.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-2xl p-3 text-center">
              <span className="text-2xl font-black text-emerald-400 font-display">{programs.length}</span>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Accredited Programs</p>
            </div>
            <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-2xl p-3 text-center">
              <span className="text-2xl font-black text-indigo-400 font-display">{recommendedPrograms.length}</span>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Deficit Remedies</p>
            </div>
            <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-2xl p-3 text-center">
              <span className="text-2xl font-black text-amber-400 font-display">{myEnrollments.length}</span>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Active Enrollments</p>
            </div>
            <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-2xl p-3 text-center">
              <span className="text-2xl font-black text-teal-300 font-display">100%</span>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Free / Subsidized</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Primary Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition flex items-center gap-2 ${
              activeTab === 'catalog'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>All Programs</span>
            <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-200">
              {filteredPrograms.length}
            </span>
          </button>

          {user?.role === 'student' && (
            <button
              onClick={() => setActiveTab('recommended')}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition flex items-center gap-2 ${
                activeTab === 'recommended'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>Recommended for You</span>
              {recommendedPrograms.length > 0 && (
                <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-emerald-800 text-emerald-100">
                  {recommendedPrograms.length}
                </span>
              )}
            </button>
          )}

          {user?.role === 'student' && (
            <button
              onClick={() => setActiveTab('enrolled')}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition flex items-center gap-2 ${
                activeTab === 'enrolled'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <BookmarkCheck className="w-4 h-4" />
              <span>My Enrolled Courses</span>
              <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-indigo-800 text-indigo-100">
                {myEnrollments.length}
              </span>
            </button>
          )}
        </div>

        {/* Shortcut to Skill Gap Explorer */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/skill-gap')}
          className="gap-2 text-xs"
        >
          <TrendingUp className="w-4 h-4 text-emerald-600" />
          <span>View Skill Gap Deficits</span>
        </Button>
      </div>

      {/* 3. Catalog Tab Content */}
      {activeTab === 'catalog' && (
        <div className="space-y-6">
          
          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search courses, skills, or providers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              {/* Type Filter */}
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <span>Type:</span>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="All">All Types</option>
                  <option value="Course">Course</option>
                  <option value="Certification">Certification</option>
                  <option value="Workshop">Workshop</option>
                  <option value="FDP">FDP</option>
                  <option value="HandsOn_Training">Hands-on Training</option>
                </select>
              </div>

              {/* Difficulty Filter */}
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <span>Difficulty:</span>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="All">All Levels</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              {/* Provider Filter */}
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <span>Provider:</span>
                <select
                  value={selectedProvider}
                  onChange={(e) => setSelectedProvider(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="All">All Providers</option>
                  <option value="Industry">Industry</option>
                  <option value="Institute">Institute</option>
                  <option value="Ministry">Ministry</option>
                  <option value="Autonomous_Body">Autonomous Body</option>
                </select>
              </div>

              {(searchQuery || selectedType !== 'All' || selectedDifficulty !== 'All' || selectedProvider !== 'All') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedType('All');
                    setSelectedDifficulty('All');
                    setSelectedProvider('All');
                  }}
                  className="text-xs text-rose-600 hover:text-rose-800 font-semibold underline px-2 py-1"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Cards Grid */}
          {loading ? (
            <div className="text-center py-16">
              <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-500">Loading learning programs...</p>
            </div>
          ) : filteredPrograms.length === 0 ? (
            <Card className="p-12 text-center">
              <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-800">No Learning Programs Match Your Filters</h3>
              <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
                Try resetting your search query or selecting "All" across type and difficulty categories.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedType('All');
                  setSelectedDifficulty('All');
                  setSelectedProvider('All');
                }}
              >
                Clear All Filters
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPrograms.map((prog) => {
                const enrollment = getEnrollmentForProgram(prog._id);
                return (
                  <ProgramCard
                    key={prog._id}
                    program={prog}
                    enrollment={enrollment}
                    onOpenModal={() => openProgramModal(prog)}
                    onEnroll={() => handleEnroll(prog)}
                    isEnrolling={enrollingId === prog._id}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 4. Recommended Tab Content */}
      {activeTab === 'recommended' && (
        <div className="space-y-6">
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-500 text-slate-950 rounded-xl">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-emerald-950">
                  Targeted Skill Deficit Recommendations
                </h3>
                <p className="text-xs text-emerald-800 mt-0.5">
                  These offerings cover key capabilities your profile currently lacks or needs to reach 85%+ career readiness benchmark.
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/assessments')}
              className="border-emerald-300 text-emerald-900 bg-white hover:bg-emerald-100/50 text-xs shrink-0"
            >
              Take Skill Quizzes
            </Button>
          </div>

          {recommendedPrograms.length === 0 ? (
            <Card className="p-12 text-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-800">No Critical Skill Deficits Detected!</h3>
              <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
                Great job! You have acquired baseline competencies across all core industry skills, or your assessments are fully up to date.
              </p>
              <Button
                variant="primary"
                size="sm"
                className="mt-4"
                onClick={() => setActiveTab('catalog')}
              >
                Browse All Advanced Programs
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedPrograms.map((prog) => {
                const enrollment = getEnrollmentForProgram(prog._id);
                return (
                  <ProgramCard
                    key={prog._id}
                    program={prog}
                    enrollment={enrollment}
                    onOpenModal={() => openProgramModal(prog)}
                    onEnroll={() => handleEnroll(prog)}
                    isEnrolling={enrollingId === prog._id}
                    isRecommendedHighlight={true}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 5. My Enrolled Courses Tab Content */}
      {activeTab === 'enrolled' && (
        <div className="space-y-6">
          <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-600 text-white rounded-xl">
                <BookmarkCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-indigo-950">
                  Active Learning Progress Tracker
                </h3>
                <p className="text-xs text-indigo-800 mt-0.5">
                  Complete program modules to auto-update your verified portfolio credentials and unlock higher employer match scores.
                </p>
              </div>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-200 text-indigo-900">
              {myEnrollments.length} Active Courses
            </span>
          </div>

          {myEnrollments.length === 0 ? (
            <Card className="p-12 text-center">
              <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-800">You Haven't Enrolled in Any Programs Yet</h3>
              <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
                Explore our industry-backed masterclasses and certifications to boost your candidate match scores.
              </p>
              <Button
                variant="primary"
                size="sm"
                className="mt-4"
                onClick={() => setActiveTab('catalog')}
              >
                Explore Course Catalog
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myEnrollments.map((item) => {
                const prog = item.program;
                if (!prog) return null;

                const isCompleted = item.status === 'Completed' || (item.progressPercentage || 0) >= 100;
                const progress = Math.min(100, item.progressPercentage || 0);

                return (
                  <Card key={item._id || prog._id} className="p-6 border-slate-200 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                          {prog.type}
                        </span>
                        {isCompleted ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Completed
                          </span>
                        ) : (
                          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
                            In Progress ({progress}%)
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-slate-900 leading-snug mb-1">
                        {prog.title}
                      </h3>

                      <p className="text-xs text-slate-500 flex items-center gap-1.5 mb-4">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>{prog.providerName} ({prog.providerType})</span>
                      </p>

                      {/* Progress Bar */}
                      <div className="space-y-1.5 mb-5">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-slate-600">Completion Status</span>
                          <span className={isCompleted ? 'text-emerald-700' : 'text-indigo-600'}>
                            {progress}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                          <div
                            className={`h-2.5 rounded-full transition-all duration-500 ${
                              isCompleted ? 'bg-emerald-500' : 'bg-indigo-600'
                            }`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Covered Skills Pills */}
                      <div className="space-y-1.5 mb-6">
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          Target Competencies
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {(prog.coveredSkills || []).map((sk) => (
                            <span
                              key={sk._id || sk}
                              className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
                            >
                              {sk.name || sk}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                      {isCompleted ? (
                        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2 w-full justify-center">
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                          <span>Verifiable Credential Active on Digital Portfolio</span>
                        </div>
                      ) : (
                        <>
                          <Button
                            variant="primary"
                            size="sm"
                            className="w-full gap-1.5 text-xs bg-indigo-600 hover:bg-indigo-700"
                            onClick={() => handleSimulateStudy(prog._id)}
                            isLoading={updatingId === prog._id}
                          >
                            <PlayCircle className="w-4 h-4" />
                            <span>Simulate Study Session (+25%)</span>
                          </Button>
                        </>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 6. Program Detail & Curriculum Modal */}
      {selectedProgram && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={selectedProgram.title}
          size="lg"
        >
          <div className="space-y-6">
            
            {/* Meta Tags */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
                {selectedProgram.type}
              </span>
              <span className="font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                {selectedProgram.difficulty} Level
              </span>
              <span className="font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                {selectedProgram.cost}
              </span>
              <span className="font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                {selectedProgram.rating} Rating
              </span>
            </div>

            {/* Provider Info */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-3">
              <div className="p-2.5 bg-white border border-slate-200 rounded-xl shadow-xs">
                <Building2 className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Accredited Provider</p>
                <h4 className="text-sm font-bold text-slate-900">
                  {selectedProgram.providerName}
                </h4>
                <p className="text-[11px] text-slate-500">
                  Affiliation Category: {selectedProgram.providerType}
                </p>
              </div>
            </div>

            {/* Detailed Description */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Program Overview & Industry Alignment
              </h4>
              <p className="text-sm text-slate-700 leading-relaxed">
                {selectedProgram.description}
              </p>
            </div>

            {/* Covered Skills */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Competencies Imparted & Verified
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(selectedProgram.coveredSkills || []).map((sk) => (
                  <div
                    key={sk._id || sk}
                    className="flex items-center gap-2 p-2.5 bg-emerald-50/70 border border-emerald-200/80 rounded-xl text-xs"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-semibold text-emerald-950">{sk.name || sk}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Program Logistics Breakdown */}
            <div className="grid grid-cols-3 gap-3 pt-2 text-center text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
                <Clock className="w-4 h-4 text-slate-500 mx-auto mb-1" />
                <span className="font-bold text-slate-800">{selectedProgram.durationHours} Hours</span>
                <p className="text-[10px] text-slate-400">Total Curriculum</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
                <Award className="w-4 h-4 text-slate-500 mx-auto mb-1" />
                <span className="font-bold text-slate-800">Accredited</span>
                <p className="text-[10px] text-slate-400">Digital Certificate</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
                <GraduationCap className="w-4 h-4 text-slate-500 mx-auto mb-1" />
                <span className="font-bold text-slate-800">{selectedProgram.enrolledStudentsCount || 0}</span>
                <p className="text-[10px] text-slate-400">Learners Enrolled</p>
              </div>
            </div>

            {/* Footer Modal Action */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <Button
                variant="outline"
                size="md"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </Button>
              {getEnrollmentForProgram(selectedProgram._id) ? (
                <Button
                  variant="secondary"
                  size="md"
                  disabled
                  className="gap-2 bg-emerald-100 text-emerald-800 cursor-not-allowed"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Already Enrolled</span>
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="md"
                  className="gap-2 bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => handleEnroll(selectedProgram)}
                  isLoading={enrollingId === selectedProgram._id}
                >
                  <BookmarkCheck className="w-4 h-4" />
                  <span>Enroll Free Now</span>
                </Button>
              )}
            </div>

          </div>
        </Modal>
      )}

    </div>
  );
}

// Subcomponent: ProgramCard
function ProgramCard({
  program,
  enrollment,
  onOpenModal,
  onEnroll,
  isEnrolling,
  isRecommendedHighlight = false
}) {
  const isEnrolled = !!enrollment;
  const isCompleted = enrollment?.status === 'Completed' || (enrollment?.progressPercentage || 0) >= 100;

  const difficultyColors = {
    Beginner: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Intermediate: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    Advanced: 'bg-purple-50 text-purple-700 border-purple-200'
  }[program.difficulty] || 'bg-slate-100 text-slate-700 border-slate-200';

  return (
    <Card
      className={`p-6 flex flex-col justify-between transition hover:shadow-md ${
        isRecommendedHighlight ? 'border-emerald-300 ring-1 ring-emerald-400/30' : 'border-slate-200'
      }`}
    >
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-900 text-white">
              {program.type}
            </span>
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${difficultyColors}`}>
              {program.difficulty}
            </span>
          </div>

          <div className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>{program.rating}</span>
          </div>
        </div>

        {/* Title */}
        <h3
          onClick={onOpenModal}
          className="text-base font-bold text-slate-900 leading-snug mb-2 hover:text-emerald-700 cursor-pointer transition line-clamp-2"
        >
          {program.title}
        </h3>

        {/* Provider Tag */}
        <p className="text-xs text-slate-500 flex items-center gap-1.5 mb-3 font-medium">
          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{program.providerName}</span>
        </p>

        {/* Description */}
        <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-3">
          {program.description}
        </p>

        {/* Covered Skills */}
        <div className="space-y-1.5 mb-5">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Target Competencies
          </p>
          <div className="flex flex-wrap gap-1.5">
            {(program.coveredSkills || []).slice(0, 3).map((sk) => (
              <span
                key={sk._id || sk}
                className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200/60"
              >
                {sk.name || sk}
              </span>
            ))}
            {(program.coveredSkills || []).length > 3 && (
              <span className="text-[10px] text-slate-500 font-semibold px-1.5 py-0.5">
                +{(program.coveredSkills || []).length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer Logistics and Buttons */}
      <div className="pt-4 border-t border-slate-100 space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{program.durationHours} hrs</span>
          </div>
          <span className="font-semibold text-emerald-700">{program.cost}</span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="w-1/2 text-xs"
            onClick={onOpenModal}
          >
            Details
          </Button>

          {isCompleted ? (
            <Button
              variant="secondary"
              size="sm"
              disabled
              className="w-1/2 text-xs bg-emerald-100 text-emerald-800 font-semibold"
            >
              Completed
            </Button>
          ) : isEnrolled ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={onOpenModal}
              className="w-1/2 text-xs bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold"
            >
              In Progress ({enrollment?.progressPercentage || 0}%)
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              className="w-1/2 text-xs bg-emerald-600 hover:bg-emerald-700"
              onClick={onEnroll}
              isLoading={isEnrolling}
            >
              Enroll Now
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
