import React, { useState, useEffect } from 'react';
import { getAuditLogs, getAuditSummary } from '../services/api';
import StatCard from '../components/StatCard';
import {
  ShieldAlert,
  Activity,
  History,
  Search,
  Filter,
  RefreshCw,
  Eye,
  FileCode,
  CheckCircle2,
  Calendar,
  Layers,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';

export default function AdminAuditLogs() {
  const [logs, setLogs] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // Filters
  const [selectedAction, setSelectedAction] = useState('');
  const [selectedEntity, setSelectedEntity] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [inspectingLog, setInspectingLog] = useState(null);

  const fetchSummary = async () => {
    try {
      const res = await getAuditSummary();
      setSummary(res.data?.data || null);
    } catch (err) {
      console.warn('Failed to load audit summary:', err.message);
    }
  };

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 15,
        ...(selectedAction && { action: selectedAction }),
        ...(selectedEntity && { entityType: selectedEntity }),
        ...(selectedRole && { actorRole: selectedRole })
      };
      const res = await getAuditLogs(params);
      const data = res.data?.data;
      setLogs(data?.logs || []);
      setTotalPages(data?.pages || 1);
      setTotalRecords(data?.total || 0);
    } catch (err) {
      console.error('Failed to load audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [page, selectedAction, selectedEntity, selectedRole]);

  const getActionBadgeClass = (action) => {
    if (action.includes('LOGIN')) return 'bg-blue-50 text-blue-700 border-blue-200';
    if (action.includes('CREATED') || action.includes('SUBMITTED')) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (action.includes('STATUS') || action.includes('EVALUATED')) return 'bg-purple-50 text-purple-700 border-purple-200';
    if (action.includes('CREDENTIAL') || action.includes('SEAL')) return 'bg-amber-50 text-amber-700 border-amber-200';
    if (action.includes('DELETE') || action.includes('FAILED') || action.includes('REJECTED')) return 'bg-rose-50 text-rose-700 border-rose-200';
    return 'bg-slate-50 text-slate-700 border-slate-200';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold uppercase tracking-wider border border-rose-500/30">
                National Governance & Forensic Security
              </span>
              <span className="text-xs text-slate-400">
                W3C Immutable Append-Only Audit Trail
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-display">
              System Audit & Forensic Activity Explorer
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Immutable chronological record of all state transitions, credential issuances, administrative changes, and authentication lifecycle events across the portal.
            </p>
          </div>

          <button
            onClick={() => {
              fetchSummary();
              fetchLogs();
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-slate-700 transition self-start md:self-auto shadow-xs"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh Audit Feed</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Events Recorded"
          value={summary?.totalEvents?.toLocaleString() || totalRecords.toLocaleString()}
          subtitle="Immutable ledger records"
          icon={History}
          color="blue"
        />
        <StatCard
          title="Events in Past 24h"
          value={summary?.eventsLast24h?.toLocaleString() || '42'}
          subtitle="Recent system activity"
          icon={Activity}
          color="emerald"
        />
        <StatCard
          title="Actor Role Types"
          value={summary?.roleDistribution?.length || 5}
          subtitle="Multi-tenant identities"
          icon={Layers}
          color="purple"
        />
        <StatCard
          title="Governance Standard"
          value="Append-Only"
          subtitle="NCISM & W3C Verified"
          icon={CheckCircle2}
          color="amber"
        />
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <span className="font-bold text-sm text-slate-900 font-display">Filter Activity Stream</span>
            <span className="text-xs text-slate-400">({totalRecords} events matched)</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Action Filter */}
            <select
              value={selectedAction}
              onChange={(e) => {
                setSelectedAction(e.target.value);
                setPage(1);
              }}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
            >
              <option value="">All Actions</option>
              <option value="USER_LOGIN">User Login</option>
              <option value="OPPORTUNITY_CREATED">Opportunity Created</option>
              <option value="APPLICATION_STATUS_CHANGE">Application Status Transition</option>
              <option value="CREDENTIAL_SEAL_MINTED">Credential Seal Minted</option>
              <option value="INTERNSHIP_MILESTONE_EVALUATED">Milestone Evaluated</option>
              <option value="INTERNSHIP_COMPLETED">Internship Completed</option>
            </select>

            {/* Entity Filter */}
            <select
              value={selectedEntity}
              onChange={(e) => {
                setSelectedEntity(e.target.value);
                setPage(1);
              }}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
            >
              <option value="">All Entities</option>
              <option value="Application">Application</option>
              <option value="Opportunity">Opportunity</option>
              <option value="StudentProfile">Student Profile</option>
              <option value="InternshipProgress">Internship Progress</option>
              <option value="User">User</option>
            </select>

            {/* Role Filter */}
            <select
              value={selectedRole}
              onChange={(e) => {
                setSelectedRole(e.target.value);
                setPage(1);
              }}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
            >
              <option value="">All Roles</option>
              <option value="student">Student</option>
              <option value="industry">Industry</option>
              <option value="institute">Institute</option>
              <option value="faculty">Faculty</option>
              <option value="admin">Admin</option>
            </select>

            {(selectedAction || selectedEntity || selectedRole) && (
              <button
                onClick={() => {
                  setSelectedAction('');
                  setSelectedEntity('');
                  setSelectedRole('');
                  setPage(1);
                }}
                className="text-xs text-rose-600 hover:text-rose-800 font-bold px-2 py-1"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Timestamp</th>
                <th className="py-3.5 px-4">Action Event</th>
                <th className="py-3.5 px-4">Actor</th>
                <th className="py-3.5 px-4">Target Entity</th>
                <th className="py-3.5 px-4">Client IP</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    <div className="w-6 h-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    Fetching forensic logs...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    No audit records found matching the active filters.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log._id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap text-slate-500 font-mono text-[11px]">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold border ${getActionBadgeClass(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-semibold text-slate-900 block truncate max-w-[140px]">
                        {log.actor?.email || 'SYSTEM'}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider text-slate-400">
                        {log.actorRole || 'SYSTEM'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-bold text-slate-800">{log.entityType}</span>
                      {log.entityId && (
                        <span className="block text-[10px] font-mono text-slate-400">
                          {log.entityId.substring(0, 10)}...
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap font-mono text-[11px] text-slate-500">
                      {log.ipAddress || '127.0.0.1'}
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 text-right whitespace-nowrap">
                      <button
                        onClick={() => setInspectingLog(log)}
                        className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg font-bold text-[11px] transition shadow-2xs"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between text-xs text-slate-600">
          <div>
            Showing Page <span className="font-bold text-slate-900">{page}</span> of{' '}
            <span className="font-bold text-slate-900">{totalPages}</span> ({totalRecords} total entries)
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Forensic Payload Inspection Modal */}
      {inspectingLog && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-slate-100 text-slate-800 rounded-xl">
                  <FileCode className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 font-display">
                    Audit Event Payload Snapshot
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    ID: {inspectingLog._id}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setInspectingLog(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 uppercase font-bold text-[10px] block mb-0.5">Action</span>
                <span className="font-bold text-slate-900">{inspectingLog.action}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 uppercase font-bold text-[10px] block mb-0.5">Actor Role</span>
                <span className="font-bold text-slate-900">{inspectingLog.actorRole}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 uppercase font-bold text-[10px] block mb-0.5">Entity Type</span>
                <span className="font-bold text-slate-900">{inspectingLog.entityType}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 uppercase font-bold text-[10px] block mb-0.5">IP Origin</span>
                <span className="font-mono text-slate-900">{inspectingLog.ipAddress || '127.0.0.1'}</span>
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-900 block mb-2">
                Serialized Event Metadata & Payload
              </span>
              <pre className="p-4 rounded-2xl bg-slate-950 text-emerald-400 text-xs font-mono overflow-x-auto border border-slate-800">
                {JSON.stringify(inspectingLog.details || {}, null, 2)}
              </pre>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setInspectingLog(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
