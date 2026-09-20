import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Award,
  Briefcase,
  Building2,
  Users,
  Compass,
  FileCheck2,
  GraduationCap,
  Sparkles,
  BookOpen,
  LineChart,
  CalendarCheck,
  ChevronRight,
  HelpCircle,
  ShieldAlert
} from 'lucide-react';

export default function Sidebar({ user, isOpen, onClose }) {
  const role = (user?.role || '').toLowerCase();

  // Define nav links dynamically per role
  let navSections = [];

  if (role === 'student') {
    navSections = [
      {
        title: 'Skill Intelligence',
        items: [
          { label: 'Overview', to: '/student', icon: Award },
          { label: 'Skill Gap Analyzer', to: '/skill-gap', icon: Compass },
          { label: 'Assessments & Quizzes', to: '/assessments', icon: FileCheck2 },
          { label: 'Learning & Courses', to: '/learning', icon: BookOpen }
        ]
      },
      {
        title: 'Career & Opportunities',
        items: [
          { label: 'Matched Opportunities', to: '/opportunities', icon: Briefcase },
          { label: 'My Applications', to: '/applications', icon: GraduationCap },
          { label: 'Internship Tracker', to: '/internship-tracker', icon: CalendarCheck },
          { label: 'Digital Portfolio', to: '/portfolio', icon: Sparkles }
        ]
      },
      {
        title: 'Collaboration',
        items: [
          { label: 'AI Team Builder', to: '/teams', icon: Users }
        ]
      }
    ];
  } else if (role === 'industry') {
    navSections = [
      {
        title: 'Talent Acquisition',
        items: [
          { label: 'Recruiter Dashboard', to: '/industry', icon: Briefcase },
          { label: 'Post Opportunity', to: '/industry/post', icon: Sparkles },
          { label: 'Candidate Applications', to: '/industry', icon: GraduationCap }
        ]
      },
      {
        title: 'Internship Management',
        items: [
          { label: 'Active Interns Tracking', to: '/industry/interns', icon: CalendarCheck },
          { label: 'Faculty Collaborations', to: '/collaborations', icon: Building2 }
        ]
      },
      {
        title: 'Innovation',
        items: [
          { label: 'AI Team Builder', to: '/teams', icon: Users }
        ]
      }
    ];
  } else if (role === 'faculty') {
    navSections = [
      {
        title: 'Academic & Research',
        items: [
          { label: 'Faculty Profile', to: '/faculty', icon: GraduationCap },
          { label: 'Research & FDPs', to: '/faculty/collaborations', icon: BookOpen },
          { label: 'Industry Sabbaticals', to: '/collaborations', icon: Building2 }
        ]
      },
      {
        title: 'Student Guidance',
        items: [
          { label: 'Student Mentorship', to: '/faculty/mentorship', icon: Award },
          { label: 'AI Team Builder', to: '/teams', icon: Users }
        ]
      }
    ];
  } else if (role === 'institute' || role === 'admin') {
    navSections = [
      {
        title: 'Institutional KPIs',
        items: [
          { label: 'Executive Analytics', to: '/institute', icon: LineChart },
          { label: 'Student Directory', to: '/institute/students', icon: GraduationCap },
          { label: 'Skill Demand Heatmap', to: '/institute/demand', icon: Compass }
        ]
      },
      ...(role === 'admin'
        ? [
            {
              title: 'Forensic Governance',
              items: [
                { label: 'System Audit Logs', to: '/admin/audit-logs', icon: ShieldAlert }
              ]
            }
          ]
        : []),
      {
        title: 'Ecosystem',
        items: [
          { label: 'AI Team Builder', to: '/teams', icon: Users }
        ]
      }
    ];
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col justify-between overflow-y-auto`}
      >
        <div className="p-4 space-y-6">
          {navSections.map((section, idx) => (
            <div key={idx}>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
                {section.title}
              </p>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => {
                        if (window.innerWidth < 1024) onClose();
                      }}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition ${
                          isActive
                            ? 'bg-emerald-50 text-emerald-800 font-semibold shadow-xs'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                        }`
                      }
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span>{item.label}</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 opacity-40" />
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Support Badge */}
        <div className="p-4 border-t border-slate-100">
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 text-xs">
            <div className="flex items-center gap-2 text-slate-700 font-semibold mb-1">
              <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Ayush Skill Portal</span>
            </div>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Standardized role benchmarking for higher-education and industrial quality.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
