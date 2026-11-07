import React, { useState } from 'react';
import { Users, MessageSquare, Calendar, Wallet, Bell, UserPlus, Film, Image as ImageIcon } from 'lucide-react';
import { CLUB_INFO } from '../data/initialData';
import { ClubNotification } from '../types/club';
import { NotificationDropdown } from './NotificationDropdown';

interface NavbarProps {
  activeTab: 'members' | 'chat' | 'events' | 'chanda' | 'gallery';
  setActiveTab: (tab: 'members' | 'chat' | 'events' | 'chanda' | 'gallery') => void;
  onAddMemberClick: () => void;
  notifications: ClubNotification[];
  onMarkNotificationAsRead: (id: string) => void;
  onMarkAllNotificationsAsRead: () => void;
  onSelectEvent?: (eventId: string) => void;
  unreadChatCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onAddMemberClick,
  notifications,
  onMarkNotificationAsRead,
  onMarkAllNotificationsAsRead,
  onSelectEvent,
  unreadChatCount = 0,
}) => {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const unreadNotifCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-6">
        {/* Zone 1: Single text element wordmark with club logo */}
        <div
          onClick={() => setActiveTab('members')}
          className="flex items-center gap-2.5 cursor-pointer whitespace-nowrap shrink-0 group"
        >
          <img
            src={CLUB_INFO.logo}
            alt="Club Ananda Sangha"
            className="w-10 h-10 rounded-full border border-amber-400/80 shadow-xs object-cover group-hover:scale-105 transition-transform"
          />
          <div className="min-w-0">
            <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <span>{CLUB_INFO.nameBn}</span>
              <span className="text-[10px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.2 rounded font-mono">
                ২০০৬
              </span>
            </span>
            <p className="text-[10px] text-slate-400 font-medium tracking-wide hidden sm:block">
              {CLUB_INFO.email}
            </p>
          </div>
        </div>

        {/* Zone 2: 5 clean single-line nav links */}
        <nav className="hidden md:flex items-center gap-5 text-xs font-semibold text-slate-600 dark:text-slate-400">
          <button
            onClick={() => setActiveTab('members')}
            className={`whitespace-nowrap shrink-0 py-2 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'members'
                ? 'border-emerald-700 text-emerald-800 dark:text-emerald-400 font-bold'
                : 'border-transparent hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>সদস্য তালিকা</span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`whitespace-nowrap shrink-0 py-2 border-b-2 transition-all flex items-center gap-1.5 relative ${
              activeTab === 'chat'
                ? 'border-emerald-700 text-emerald-800 dark:text-emerald-400 font-bold'
                : 'border-transparent hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <span>হোয়াটসঅ্যাপ চ্যাট</span>
            {unreadChatCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-600 text-white text-[9px] font-bold">
                {unreadChatCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('gallery')}
            className={`whitespace-nowrap shrink-0 py-2 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'gallery'
                ? 'border-emerald-700 text-emerald-800 dark:text-emerald-400 font-bold'
                : 'border-transparent hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Film className="w-4 h-4 text-red-500" />
            <span>গ্যালারি ও ভিডিও</span>
          </button>

          <button
            onClick={() => setActiveTab('events')}
            className={`whitespace-nowrap shrink-0 py-2 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'events'
                ? 'border-emerald-700 text-emerald-800 dark:text-emerald-400 font-bold'
                : 'border-transparent hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>ইভেন্ট ও নোটিশ</span>
          </button>

          <button
            onClick={() => setActiveTab('chanda')}
            className={`whitespace-nowrap shrink-0 py-2 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'chanda'
                ? 'border-emerald-700 text-emerald-800 dark:text-emerald-400 font-bold'
                : 'border-transparent hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>চাঁদা ও রশিদ</span>
          </button>
        </nav>

        {/* Zone 3: 1 Primary action (+ Notification bell) */}
        <div className="flex items-center gap-3 shrink-0 relative">
          {/* Notification Bell */}
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="ক্লাব নোটিফিকেশন"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900" />
            )}
          </button>

          {/* Primary Action Button */}
          <button
            onClick={onAddMemberClick}
            className="px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs hover:shadow-md transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ সদস্য যোগ করুন</span>
          </button>

          {/* Notification Popover */}
          <NotificationDropdown
            isOpen={isNotifOpen}
            onClose={() => setIsNotifOpen(false)}
            notifications={notifications}
            onMarkAsRead={onMarkNotificationAsRead}
            onMarkAllAsRead={onMarkAllNotificationsAsRead}
            onSelectEvent={onSelectEvent}
          />
        </div>
      </div>

      {/* Mobile Sub Navigation Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-2 py-2 text-[11px] font-semibold text-slate-600 dark:text-slate-400">
        <button
          onClick={() => setActiveTab('members')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg ${
            activeTab === 'members' ? 'text-emerald-700 dark:text-emerald-400 font-bold' : ''
          }`}
        >
          <Users className="w-4 h-4" />
          <span>সদস্য</span>
        </button>

        <button
          onClick={() => setActiveTab('chat')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg relative ${
            activeTab === 'chat' ? 'text-emerald-700 dark:text-emerald-400 font-bold' : ''
          }`}
        >
          <MessageSquare className="w-4 h-4 text-emerald-600" />
          <span>চ্যাট</span>
          {unreadChatCount > 0 && (
            <span className="absolute -top-0.5 right-2 w-2 h-2 rounded-full bg-emerald-600" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('gallery')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg ${
            activeTab === 'gallery' ? 'text-emerald-700 dark:text-emerald-400 font-bold' : ''
          }`}
        >
          <Film className="w-4 h-4 text-red-500" />
          <span>গ্যালারি</span>
        </button>

        <button
          onClick={() => setActiveTab('events')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg ${
            activeTab === 'events' ? 'text-emerald-700 dark:text-emerald-400 font-bold' : ''
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>ইভেন্ট</span>
        </button>

        <button
          onClick={() => setActiveTab('chanda')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg ${
            activeTab === 'chanda' ? 'text-emerald-700 dark:text-emerald-400 font-bold' : ''
          }`}
        >
          <Wallet className="w-4 h-4" />
          <span>চাঁদা</span>
        </button>
      </div>
    </header>
  );
};
