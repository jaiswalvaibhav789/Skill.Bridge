import React, { useState, useEffect } from 'react';
import { getFacultyProfile, updateFacultyProfile, getFacultyCollaborations } from '../services/api';
import { useToast } from '../context/ToastContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import Tabs from '../components/common/Tabs';
import {
  GraduationCap,
  BookOpen,
  Briefcase,
  Building,
  Award,
  Edit3,
  ExternalLink,
  Calendar,
  Sparkles,
  Users
} from 'lucide-react';

export default function FacultyDashboard() {
  const [profile, setProfile] = useState(null);
  const [collaborations, setCollaborations] = useState({ researchFellowships: [], facultyDevelopmentPrograms: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Edit form state
  const [department, setDepartment] = useState('');
  const [designation, setDesignation] = useState('');
  const [yearsExperience, setYearsExperience] = useState(0);
  const [bio, setBio] = useState('');
  const [saving, setSaving] = useState(false);

  const { toastSuccess, toastError } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [profileRes, collabRes] = await Promise.all([
        getFacultyProfile(),
        getFacultyCollaborations()
      ]);

      const profData = profileRes.data?.data || profileRes.data?.profile || profileRes.data;
      setProfile(profData);
      setDepartment(profData.department || '');
      setDesignation(profData.designation || '');
      setYearsExperience(profData.yearsExperience || 0);
      setBio(profData.bio || '');

      const collabData = collabRes.data?.data || collabRes.data;
      setCollaborations(collabData || { researchFellowships: [], facultyDevelopmentPrograms: [] });
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to load faculty information');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await updateFacultyProfile({
        department,
        designation,
        yearsExperience: Number(yearsExperience),
        bio
      });
      const updated = res.data?.data || res.data?.profile || res.data;
      setProfile(updated);
      setIsEditModalOpen(false);
      toastSuccess('Faculty profile updated successfully!');
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-slate-500">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="font-semibold text-sm">Loading Faculty Academic Profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-slate-950 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 flex-shrink-0">
              <GraduationCap className="w-9 h-9" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold font-display">{profile?.fullName}</h1>
                <Badge variant="verified">Academician</Badge>
              </div>
              <p className="text-indigo-200 text-sm">
                {profile?.designation} • Department of {profile?.department}
              </p>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                <Building className="w-3.5 h-3.5" />
                <span>{profile?.institute?.instituteName || 'All India Institute of Ayurveda'}</span>
                <span>• {profile?.yearsExperience} Years Experience</span>
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            className="bg-white/10 hover:bg-white/20 text-white border-white/20"
            icon={Edit3}
            onClick={() => setIsEditModalOpen(true)}
          >
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        activeTab={activeTab}
        onChange={setActiveTab}
        tabs={[
          { id: 'profile', label: 'Research & Publications', icon: BookOpen },
          { id: 'collaborations', label: 'FDPs & Corporate Consulting', icon: Briefcase, count: (collaborations.researchFellowships?.length || 0) + (collaborations.facultyDevelopmentPrograms?.length || 0) },
          { id: 'mentorship', label: 'Mentorship & Innovation', icon: Users }
        ]}
      />

      {/* Tab 1: Profile & Research */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bio & Overview */}
          <div className="lg:col-span-1 space-y-6">
            <Card title="About Academician" icon={Award}>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                {profile?.bio || 'Senior professor committed to bridging classical Ayush treatises with modern phytopharmacological research.'}
              </p>
              <div className="pt-4 border-t border-slate-100 space-y-2.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 font-medium">Department:</span>
                  <span className="font-semibold text-slate-800">{profile?.department}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 font-medium">Experience:</span>
                  <span className="font-semibold text-slate-800">{profile?.yearsExperience} Years</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 font-medium">Institute Code:</span>
                  <span className="font-mono text-slate-800">{profile?.institute?.aisheCode || 'C-54321'}</span>
                </div>
              </div>
            </Card>

            <Card title="Areas of Expertise" icon={Sparkles}>
              <div className="flex flex-wrap gap-1.5">
                {(profile?.expertise?.length ? profile.expertise : ['Herbal Standardization', 'Clinical Phyto-pharmacology', 'Schedule T Ayush GMP', 'HPTLC Fingerprinting']).map((exp, i) => (
                  <span key={i} className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-lg border border-indigo-100">
                    {exp}
                  </span>
                ))}
              </div>
            </Card>
          </div>

          {/* Publications & Consulting */}
          <div className="lg:col-span-2 space-y-6">
            <Card title="Peer-Reviewed Publications" subtitle="Indexed academic papers and monographs" icon={BookOpen}>
              <div className="space-y-3">
                {(profile?.publications?.length ? profile.publications : [
                  { title: 'Standardization Markers in Withania somnifera Extracts', journal: 'Journal of Ayush Sciences', year: 2023, doiOrLink: 'https://doi.org/10.1016/j.jaim.2023.100' },
                  { title: 'Comparative Chromatographic Analysis of Classical Polyherbal Formulations', journal: 'International Journal of Ayurvedic Research', year: 2022, doiOrLink: '#' }
                ]).map((pub, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-slate-200/80 hover:border-indigo-300 transition bg-slate-50/50">
                    <h4 className="font-semibold text-sm text-slate-900 leading-snug">{pub.title}</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Published in <span className="italic font-medium text-slate-700">{pub.journal}</span> • {pub.year}
                    </p>
                    {pub.doiOrLink && (
                      <a
                        href={pub.doiOrLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 font-medium mt-2"
                      >
                        <span>View Publication</span> <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Corporate Consulting & Industry Projects" subtitle="Commercial joint projects with pharma & wellness partners" icon={Briefcase}>
              <div className="space-y-3">
                {(profile?.industryConsultingHistory?.length ? profile.industryConsultingHistory : [
                  { companyName: 'Dabur Research Foundation', projectTitle: 'Quality control optimization of Polyherbal formulations', year: 2024, description: 'HPTLC finger-printing protocol validation.' }
                ]).map((proj, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-sm text-slate-900">{proj.projectTitle}</h4>
                      <Badge variant="neutral">{proj.year}</Badge>
                    </div>
                    <p className="text-xs font-medium text-indigo-600 mt-0.5">{proj.companyName}</p>
                    <p className="text-xs text-slate-600 mt-2">{proj.description}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Tab 2: Collaborations */}
      {activeTab === 'collaborations' && (
        <div className="space-y-6">
          <Card title="Corporate Research Fellowships & Clinical Sabbaticals" subtitle="Sponsored by pharmaceutical partners" icon={Briefcase}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {collaborations.researchFellowships?.length > 0 ? (
                collaborations.researchFellowships.map((f) => (
                  <div key={f._id} className="p-5 rounded-2xl border border-slate-200 hover:shadow-sm transition bg-white flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="verified">{f.type}</Badge>
                        <span className="text-xs text-slate-500 font-medium">{f.location}</span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-900">{f.title}</h4>
                      <p className="text-xs text-indigo-600 font-medium mt-0.5">{f.industry?.companyName}</p>
                      <p className="text-xs text-slate-600 mt-2 line-clamp-3">{f.description}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-700">{f.stipendOrSalary}</span>
                      <Button size="sm" variant="outline">Apply as PI / Fellow</Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 italic p-4">No active research fellowship calls currently posted.</p>
              )}
            </div>
          </Card>

          <Card title="Faculty Development Programs (FDPs) & Masterclasses" subtitle="Ministry & Industry accredited upskilling modules" icon={BookOpen}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {collaborations.facultyDevelopmentPrograms?.length > 0 ? (
                collaborations.facultyDevelopmentPrograms.map((fdp) => (
                  <div key={fdp._id} className="p-5 rounded-2xl border border-slate-200 bg-white flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="match-high">{fdp.type}</Badge>
                        <span className="text-xs text-slate-500 font-medium">{fdp.durationHours} Hours</span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-900">{fdp.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">By {fdp.providerName}</p>
                      <p className="text-xs text-slate-600 mt-2">{fdp.description}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-semibold text-emerald-700">{fdp.cost}</span>
                      <Button size="sm" variant="ayush">Register for FDP</Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 italic p-4">No upcoming FDPs scheduled.</p>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Tab 3: Mentorship */}
      {activeTab === 'mentorship' && (
        <Card title="Student Mentorship & Live Project Guidance" subtitle="Facilitate multidisciplinary student teams" icon={Users}>
          <div className="p-6 text-center max-w-lg mx-auto">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-base text-slate-900">Ayush Innovation Mentorship Cell</h4>
            <p className="text-xs text-slate-500 mt-1 mb-6">
              Connect with student cohorts competing in Smart India Hackathon and Ayush startups seeking academic mentorship.
            </p>
            <Button
              variant="primary"
              onClick={() => window.location.href = '/teams'}
              icon={Users}
            >
              Open AI Team Builder
            </Button>
          </div>
        </Card>
      )}

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Faculty Profile"
        subtitle="Update your department, academic rank, and biographical highlights"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleUpdateProfile} isLoading={saving}>Save Changes</Button>
          </>
        }
      >
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Designation</label>
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
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Years Experience</label>
              <input
                type="number"
                value={yearsExperience}
                onChange={(e) => setYearsExperience(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Biographical Statement</label>
            <textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="Highlight research contributions, patent records, and academic background..."
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
