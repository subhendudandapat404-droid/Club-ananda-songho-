import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { Member } from '../types/club';

interface DeleteConfirmModalProps {
  member: Member | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmDelete: (id: string) => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  member,
  isOpen,
  onClose,
  onConfirmDelete,
}) => {
  if (!isOpen || !member) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                সদস্যপদ বাতিল বা মুছে ফেলতে চান?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                আপনি কি নিশ্চিত যে আপনি <strong>{member.name}</strong> ({member.role.split('(')[0].trim()}) -কে ক্লাব আনন্দ সংঘের সদস্য তালিকা থেকে মুছে ফেলতে চান? এই প্রক্রিয়া অপরিবর্তনীয়।
              </p>

              {/* Mini Member Card Preview */}
              <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center gap-3">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-10 h-10 rounded-xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                    {member.name}
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono">ID: {member.id} · {member.bloodGroup}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              বাতিল
            </button>
            <button
              onClick={() => {
                onConfirmDelete(member.id);
                onClose();
              }}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-md shadow-red-900/20 flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              হ্যাঁ, মুছে ফেলুন
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
