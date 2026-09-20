import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, CheckCircle2, TrendingUp, Users, Building2, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col justify-between">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-28 bg-gradient-to-b from-emerald-950 via-emerald-900 to-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-800/80 border border-emerald-500/30 text-emerald-200 text-xs font-semibold mb-6">
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
            <span>Ministry of Ayush • Smart India Hackathon 2026 (SIH26044)</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
            Bridging <span className="text-emerald-400">Ayush Academia</span> with Modern Healthcare & Industry
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-emerald-100/80 max-w-2xl mx-auto leading-relaxed">
            Centralized ecosystem for intelligent skill mapping, real-time match scores, gap analysis, and verified placements across Ayurveda, Yoga, Unani, Siddha, and Homeopathy.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold bg-emerald-500 hover:bg-emerald-400 text-emerald-950 shadow-lg shadow-emerald-500/25 transition"
            >
              <span>Explore Opportunities</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/10 backdrop-blur-sm transition"
            >
              Recruiter / College Portal
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Pillar Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 mb-16 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900">Smart Skill Matching</h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Automated compatibility algorithm calculating match percentages between student clinical competencies and industry requirements.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center mb-4">
              <TrendingUp className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900">Skill Gap Diagnostics</h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Pinpoints exact missing competencies (e.g., Schedule T GMP compliance, Nadi Pariksha, Clinical Trials) and recommends bridge courses.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4">
              <Building2 className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900">Institute Analytics</h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Real-time dashboards for colleges and the Ministry tracking placement ratios and trending industry skill demands nationwide.
            </p>
          </div>
        </div>
      </section>

      {/* SIH 2026 Innovation Showcase: Complementary Team Formation */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white border border-emerald-500/30 shadow-2xl relative overflow-hidden">
          
          <div className="max-w-3xl mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-3 border border-emerald-400/30">
              <Sparkles className="h-3.5 w-3.5" />
              <span>SIH 2026 Core Paradigm Shift</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              From Resume Floods to <span className="text-emerald-400">AI-Assembled Complementary Teams</span>
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
              Traditional portals stop at individual matching and inundate recruiters with 500 unranked CVs. SkillBridge Ayush dynamically forms balanced 4-member multidisciplinary squads around real industry problems.
            </p>
          </div>

          {/* 7-Step Interactive Pipeline Flow */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md mb-8">
            <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-4">
              Algorithmic Problem-to-Team Workflow
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3 text-center text-xs">
              {[
                { label: 'Industry Problem', sub: 'E.g. Plant Inventory' },
                { label: 'AI Decomposes', sub: 'Parses requirements' },
                { label: 'Required Skills', sub: 'React, Node, Mongo, QC' },
                { label: 'Skill Graph Search', sub: 'Verified talent pool' },
                { label: 'Complementary Team', sub: 'Synergistic 4-squad' },
                { label: 'Missing Skill Alert', sub: 'Micro-learning bridge' },
                { label: 'Team Proposed', sub: '1-click invite dispatch' }
              ].map((step, sIdx) => (
                <div key={sIdx} className="bg-white/5 hover:bg-emerald-500/20 border border-white/10 p-3 rounded-xl transition">
                  <span className="inline-block w-6 h-6 rounded-full bg-emerald-500 text-emerald-950 font-black text-xs leading-6 mb-1">
                    {sIdx + 1}
                  </span>
                  <p className="font-bold text-white text-[11px]">{step.label}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{step.sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Benchmark Example Showcase */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="space-y-3 text-xs text-slate-300">
              <p className="font-bold text-sm text-emerald-300">
                Benchmark Challenge: Smart Medicinal Plant Inventory System
              </p>
              <p>
                • <strong className="text-white">Squad Size:</strong> 4 Members | <strong className="text-white">Duration:</strong> 6 Weeks
              </p>
              <p>
                • <strong className="text-white">Deliverables:</strong> Dashboard + API + Inventory Module + Quality Analytics
              </p>
              <p>
                • <strong className="text-white">Synergistic Roles:</strong> Frontend Specialist (React) + Backend Architect (Node) + Supply Chain & GMP Lead (MongoDB) + Ayush Domain & QC Analyst (Data Analytics & Dravyaguna).
              </p>
            </div>

            <div className="flex justify-start md:justify-end">
              <Link
                to="/teams"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/30 transition text-sm"
              >
                <span>Launch AI Team Builder</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <p>© 2026 SkillBridge Ayush. Ministry of Ayush - Smart India Hackathon 2026 Prototype.</p>
      </footer>
    </div>
  );
}
