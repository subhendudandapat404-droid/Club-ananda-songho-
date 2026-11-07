import React from 'react';
import { Bell, Check, Trash2, Calendar, AlertTriangle, ShieldCheck, X } from 'lucide-react';
import { ClubNotification } from '../types/club';

interface NotificationDropdownProps {
  notifications: ClubNotification[];
  isOpen: boolean;
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onSelectEvent?: (eventId: string) => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  notifications,
  isOpen,
  onClose,
  onMarkAsRead,
  onMarkAllAsRead,
  onSelectEvent,
}) => {
  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="absolute right-0 top-12 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
      {/* Header */}
      <div className="p-3.5 bg-emerald-800 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-amber-300" />
          <h4 className="font-bold text-xs">ক্লাব নোটিফিকেশন ({unreadCount})</h4>
        </div>
        <div className="flex items-center gap-2 text-xs">
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllAsRead}
              className="text-[11px] text-emerald-200 hover:text-white underline font-medium"
            >
              সব পড়া হয়েছে
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-700/60"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Notification items */}
      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 text-xs">
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-slate-400">কোনো নোটিফিকেশন নেই</div>
        ) : (
          notifications.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                onMarkAsRead(item.id);
                if (item.eventId && onSelectEvent) {
                  onSelectEvent(item.eventId);
                  onClose();
                }
              }}
              className={`p-3.5 transition-colors cursor-pointer flex items-start gap-3 ${
                item.read
                  ? 'bg-white dark:bg-slate-900 opacity-70'
                  : 'bg-emerald-50/50 dark:bg-emerald-950/30'
              } hover:bg-slate-50 dark:hover:bg-slate-800/60`}
            >
              <div className="mt-0.5 shrink-0">
                {item.type === 'emergency' ? (
                  <div className="w-7 h-7 rounded-lg bg-red-100 dark:bg-red-950/60 text-red-600 flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                ) : item.type === 'event' ? (
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 flex items-center justify-center">
                    <Calendar className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-700 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h5 className="font-bold text-slate-900 dark:text-slate-100 text-[11.5px] truncate">
                    {item.title}
                  </h5>
                  <span className="text-[10px] text-slate-400 shrink-0">{item.timestamp}</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                  {item.message}
                </p>
                <div className="flex items-center justify-between mt-2 text-[10px] text-slate-400">
                  <span>প্রেরক: {item.sender}</span>
                  {!item.read && (
                    <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
