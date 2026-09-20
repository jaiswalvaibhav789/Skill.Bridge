import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getAssessments, getAssessmentById, submitAssessment } from '../services/api';
import { useToast } from '../context/ToastContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import {
  FileCheck2,
  Clock,
  Award,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  BookOpen
} from 'lucide-react';

export default function AssessmentRunner() {
  const { id: routeAssessmentId } = useParams();
  const navigate = useNavigate();
  const { toastSuccess, toastError, toastInfo } = useToast();

  const [assessmentsList, setAssessmentsList] = useState([]);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Active Quiz Session State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { [questionId]: selectedOptionKey }
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizResult, setQuizResult] = useState(null);

  useEffect(() => {
    if (routeAssessmentId) {
      loadAssessmentSession(routeAssessmentId);
    } else {
      loadAssessmentsList();
    }
  }, [routeAssessmentId]);

  // Countdown timer effect
  useEffect(() => {
    if (!quizResult && timeLeft > 0 && selectedAssessment) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, quizResult, selectedAssessment]);

  const loadAssessmentsList = async () => {
    try {
      setLoading(true);
      const res = await getAssessments();
      const data = res.data?.data || res.data || [];
      setAssessmentsList(data);
    } catch (err) {
      toastError('Failed to load available assessments');
    } finally {
      setLoading(false);
    }
  };

  const loadAssessmentSession = async (assessmentId) => {
    try {
      setLoading(true);
      setQuizResult(null);
      setAnswers({});
      setCurrentQuestionIndex(0);

      const res = await getAssessmentById(assessmentId);
      const data = res.data?.data || res.data;
      setSelectedAssessment(data.assessment);
      setQuestions(data.questions || []);
      setTimeLeft((data.assessment?.timeLimitMinutes || 15) * 60);
      toastInfo(`Starting ${data.assessment?.title}. Timer has started!`);
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to start assessment');
      navigate('/assessments');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (questionId, optionKey) => {
    if (quizResult) return;
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionKey
    }));
  };

  const handleAutoSubmit = () => {
    toastInfo('Time expired! Automatically submitting your answers...');
    handleSubmit();
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    // Format answers array
    const formattedAnswers = questions.map((q) => ({
      questionId: q._id,
      selectedOptionKey: answers[q._id] || null
    }));

    try {
      setIsSubmitting(true);
      const res = await submitAssessment(selectedAssessment._id, {
        answers: formattedAnswers,
        timeTakenSeconds: (selectedAssessment.timeLimitMinutes * 60) - timeLeft
      });
      const resultData = res.data?.data || res.data;
      setQuizResult(resultData);

      if (resultData.passed) {
        toastSuccess(`Passed! Your score: ${resultData.scorePercentage}%. Verified on your skill profile!`);
      } else {
        toastInfo(`Score: ${resultData.scorePercentage}%. Passing threshold was ${resultData.passingScorePercentage}%.`);
      }
    } catch (err) {
      toastError(err.response?.data?.message || 'Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 1. Loading View
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-slate-500">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="font-semibold text-sm">Loading Skill Assessment Engine...</p>
        </div>
      </div>
    );
  }

  // 2. Active Assessment Quiz View
  if (selectedAssessment && questions.length > 0) {
    const currentQ = questions[currentQuestionIndex];
    const answeredCount = Object.keys(answers).length;
    const progressPercent = Math.round(((currentQuestionIndex + 1) / questions.length) * 100);

    // 2A. Results Screen
    if (quizResult) {
      return (
        <div className="max-w-2xl mx-auto py-6">
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl text-center space-y-6">
            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto shadow-md ${
              quizResult.passed ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
            }`}>
              {quizResult.passed ? <CheckCircle2 className="w-10 h-10" /> : <XCircle className="w-10 h-10" />}
            </div>

            <div>
              <Badge variant={quizResult.passed ? 'match-high' : 'critical'} size="lg">
                {quizResult.passed ? 'Assessment Passed' : 'Needs Practice'}
              </Badge>
              <h2 className="text-3xl font-bold font-display text-slate-900 mt-2">
                Your Score: {quizResult.scorePercentage}%
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                You answered {quizResult.correctAnswers} of {quizResult.totalQuestions} questions correctly.
                (Passing threshold: {quizResult.passingScorePercentage}%)
              </p>
            </div>

            {quizResult.skillUpdated && (
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900 text-xs flex items-center gap-3 text-left">
                <ShieldCheck className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                <div>
                  <span className="font-bold block">Verified on Candidate Profile</span>
                  <span>Your skill proficiency score has been updated in real-time on your digital radar!</span>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="outline"
                icon={RotateCcw}
                onClick={() => loadAssessmentSession(selectedAssessment._id)}
              >
                Retake Assessment
              </Button>
              <Button
                variant="ayush"
                icon={ArrowRight}
                onClick={() => navigate('/student')}
              >
                View Skill Profile
              </Button>
            </div>
          </div>
        </div>
      );
    }

    // 2B. Ongoing Question Interface
    return (
      <div className="max-w-3xl mx-auto space-y-6 py-4">
        {/* Top Header Card: Title, Progress & Timer */}
        <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-lg border border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-md border border-emerald-800">
                {selectedAssessment.category} • {selectedAssessment.difficulty}
              </span>
              <h2 className="text-xl font-bold font-display mt-2 text-white">
                {selectedAssessment.title}
              </h2>
            </div>

            {/* Countdown Badge */}
            <div className="flex items-center gap-2 bg-slate-800/80 px-4 py-2 rounded-2xl border border-slate-700">
              <Clock className={`w-4 h-4 ${timeLeft < 120 ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`} />
              <span className={`font-mono text-sm font-bold ${timeLeft < 120 ? 'text-rose-400' : 'text-white'}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-xs text-slate-400 mb-1.5 font-medium">
              <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
              <span>{answeredCount} of {questions.length} Answered</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Question Prompt Card */}
        <Card>
          <div className="space-y-6">
            <div className="flex items-start gap-3">
              <span className="w-7 h-7 rounded-xl bg-slate-100 font-bold text-xs text-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                {currentQuestionIndex + 1}
              </span>
              <p className="font-semibold text-base text-slate-900 leading-relaxed">
                {currentQ.prompt}
              </p>
            </div>

            {/* Options List */}
            <div className="space-y-2.5 pt-2">
              {currentQ.options.map((opt) => {
                const isSelected = answers[currentQ._id] === opt.optionKey;
                return (
                  <button
                    key={opt.optionKey}
                    type="button"
                    onClick={() => handleSelectOption(currentQ._id, opt.optionKey)}
                    className={`w-full p-4 rounded-2xl border text-left flex items-center gap-3.5 transition-all ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-950 shadow-xs ring-2 ring-emerald-400/20'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50/80'
                    }`}
                  >
                    <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs transition ${
                      isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {opt.optionKey}
                    </span>
                    <span className="text-sm font-medium leading-snug">{opt.text}</span>
                  </button>
                );
              })}
            </div>

            {/* Navigation & Submit Action Footer */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                icon={ChevronLeft}
                disabled={currentQuestionIndex === 0}
                onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
              >
                Previous
              </Button>

              <div className="flex items-center gap-2">
                {currentQuestionIndex < questions.length - 1 ? (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setCurrentQuestionIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                  >
                    Next Question <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                ) : (
                  <Button
                    variant="ayush"
                    size="sm"
                    isLoading={isSubmitting}
                    onClick={handleSubmit}
                  >
                    Submit Assessment <CheckCircle2 className="w-4 h-4 ml-1" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // 3. Assessments Catalog View (default /assessments)
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 rounded-3xl p-8 text-white shadow-xl">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
              Empirical Skill Intelligence
            </span>
          </div>
          <h1 className="text-3xl font-bold font-display">Diagnostic Skill Assessments</h1>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Verify your competencies through standardized timed diagnostic assessments aligned with Schedule T GMP, Clinical diagnostics, and research protocols.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assessmentsList.map((quiz) => (
          <div
            key={quiz._id}
            className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <Badge variant="verified">{quiz.category}</Badge>
                <Badge variant="neutral">{quiz.difficulty}</Badge>
              </div>
              <h3 className="font-bold text-base font-display text-slate-900 leading-snug">
                {quiz.title}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Target Competency: <span className="font-semibold text-emerald-700">{quiz.skill?.name || 'Ayush Standard'}</span>
              </p>

              <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 rounded-xl bg-slate-50">
                  <span className="text-slate-400 block text-[10px]">Questions</span>
                  <span className="font-bold text-slate-800">{quiz.totalQuestions || 5}</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50">
                  <span className="text-slate-400 block text-[10px]">Time Limit</span>
                  <span className="font-bold text-slate-800">{quiz.timeLimitMinutes}m</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50">
                  <span className="text-slate-400 block text-[10px]">Passing</span>
                  <span className="font-bold text-emerald-700">{quiz.passingScorePercentage}%</span>
                </div>
              </div>
            </div>

            <Button
              variant="ayush"
              size="md"
              className="w-full mt-6"
              icon={FileCheck2}
              onClick={() => navigate(`/assessments/${quiz._id}`)}
            >
              Start Assessment
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
