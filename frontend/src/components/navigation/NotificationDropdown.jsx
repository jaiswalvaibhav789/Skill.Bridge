import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getMyNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  clearAllReadNotifications
} from '../../services/api';
import {
  Bell,
  CheckCheck,
  Trash2,
  ExternalLink,
  GraduationCap,
  Sparkles,
  Award,
  ShieldCheck,
  CalendarCheck,
  AlertCircle,
  Clock,
  X
} from 'lucide-react';

export default function NotificationDropdown({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all' | 'unread'
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await getMyNotifications({ unreadOnly: filter === 'unread' });
      setNotifications(res.data?.data?.notifications || []);
      setUnreadCount(res.data?.data?.unreadCount || 0);
    } catch (err) {
      console.warn('Failed to load notifications:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [user, filter]);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.isRead) {
        await markNotificationRead(notification._id);
        setNotifications(prev =>
          prev.map(n => (n._id === notification._id ? { ...n, isRead: true } : n))
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      if (notification.link) {
        setIsOpen(false);
        navigate(notification.link);
      }
    } catch (err) {
      console.error('Error opening notification:', err);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      await deleteNotification(id);
      setNotifications(prev => prev.filter(n => n._id !== id));
      const updated = await getMyNotifications();
      setUnreadCount(updated.data?.data?.unreadCount || 0);
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  const handleClearAllRead = async () => {
    try {
      await clearAllReadNotifications();
      setNotifications(prev => prev.filter(n => !n.isRead));
    } catch (err) {
      console.error('Error clearing read notifications:', err);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'APPLICATION_UPDATE':
        return <GraduationCap className="w-4 h-4 text-emerald-600" />;
      case 'OPPORTUNITY_MATCH':
        return <Sparkles className="w-4 h-4 text-amber-600" />;
      case 'SKILL_ENDORSED':
        return <ShieldCheck className="w-4 h-4 text-purple-600" />;
      case 'ASSESSMENT_COMPLETED':
        return <Award className="w-4 h-4 text-blue-600" />;
      case 'MENTOR_FEEDBACK':
        return <CalendarCheck className="w-4 h-4 text-indigo-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-slate-600" />;
    }
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    const now = new Date();
    const past = new Date(dateStr);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) fetchNotifications();
        }}
        title="Notifications"
        className="relative p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition focus:outline-hidden"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-slate-900 animate-subtle-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Floating Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 text-slate-900">
          
          {/* Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-slate-900 font-display">Notifications</span>
              {unreadCount > 0 && (
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  title="Mark all as read"
                  className="p-1 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span className="text-[11px] hidden sm:inline">Mark read</span>
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="px-4 py-2 border-b border-slate-100 flex items-center gap-2 text-xs bg-white">
            <button
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 rounded-lg font-bold transition ${
                filter === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-2.5 py-1 rounded-lg font-bold transition ${
                filter === 'unread'
                  ? 'bg-emerald-700 text-white'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>

          {/* Notification List Body */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100">
            {loading && notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                Loading alerts...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                <Bell className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p className="font-semibold text-slate-600">All caught up!</p>
                <p className="text-[11px] text-slate-400 mt-0.5">No notifications at this moment.</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  onClick={() => handleNotificationClick(n)}
                  className={`p-3.5 transition flex items-start gap-3 cursor-pointer hover:bg-slate-50 group relative ${
                    !n.isRead ? 'bg-emerald-50/30' : 'bg-white'
                  }`}
                >
                  {/* Category Icon */}
                  <div className="p-2 rounded-xl bg-slate-100 group-hover:bg-white group-hover:shadow-2xs transition shrink-0 mt-0.5">
                    {getTypeIcon(n.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <p className={`text-xs font-bold truncate ${!n.isRead ? 'text-slate-900' : 'text-slate-700'}`}>
                        {n.title}
                      </p>
                      <span className="text-[10px] text-slate-400 shrink-0 flex items-center gap-0.5">
                        <Clock className="w-2.5 h-2.5" />
                        {formatTime(n.createdAt)}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-snug line-clamp-2">
                      {n.message}
                    </p>

                    {n.link && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 mt-1.5 hover:underline">
                        <span>View details</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </div>

                  {/* Unread indicator dot & Delete action */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    {!n.isRead && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    )}
                    <button
                      onClick={(e) => handleDelete(e, n._id)}
                      title="Delete notification"
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.some(n => n.isRead) && (
            <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
              <button
                onClick={handleClearAllRead}
                className="text-[11px] text-slate-500 hover:text-slate-900 font-semibold transition"
              >
                Clear read notifications
              </button>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
