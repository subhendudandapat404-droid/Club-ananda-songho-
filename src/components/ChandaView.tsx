import React, { useState } from 'react';
import {
  Wallet,
  CheckCircle2,
  Clock,
  Printer,
  Share2,
  Receipt,
  FileCheck,
  Search,
  ArrowUpRight,
  X,
  CreditCard,
} from 'lucide-react';
import { Member } from '../types/club';
import { CLUB_INFO } from '../data/initialData';

interface ChandaViewProps {
  members: Member[];
  onToggleStatus: (memberId: string) => void;
}

export const ChandaView: React.FC<ChandaViewProps> = ({ members, onToggleStatus }) => {
  const [filter, setFilter] = useState<'all' | 'paid' | 'due'>('all');
  const [search, setSearch] = useState('');
  const [selectedReceiptMember, setSelectedReceiptMember] = useState<Member | null>(null);

  const totalMembers = members.length;
  const paidMembers = members.filter((m) => m.subscriptionStatus === 'paid');
  const dueMembers = members.filter((m) => m.subscriptionStatus === 'due');

  const totalMonthlyTarget = members.reduce((acc, m) => acc + m.monthlyFee, 0);
  const collectedAmount = paidMembers.reduce((acc, m) => acc + m.monthlyFee, 0);
  const dueAmount = dueMembers.reduce((acc, m) => acc + m.monthlyFee, 0);

  const filtered = members.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.phone.toLowerCase().includes(search.toLowerCase()) ||
      m.id.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (filter === 'paid') return m.subscriptionStatus === 'paid';
    if (filter === 'due') return m.subscriptionStatus === 'due';
    return true;
  });

  const sendWhatsAppReminder = (member: Member) => {
    const text = `নমস্কার ${member.name} দা/ভাই,\nক্লাব আনন্দ সংঘের পক্ষ থেকে বিনীত অনুরোধ—চলতি নভেম্বর ২০২৬ মাসের ক্লাব চাঁদা ৳${member.monthlyFee} বকেয়া রয়েছে। অনুগ্রহ করে ক্লাবের কোষাধ্যক্ষ সমীর রায় মহাশয়ের কাছে চাঁদা জমা দিয়ে রশিদ সংগ্রহ করুন।\nধন্যবাদান্তে,\nক্লাব আনন্দ সংঘ।`;
    const url = `https://api.whatsapp.com/send?phone=${member.phone.replace(/[^0-9]/g, '')}&text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <span>মাসিক চাঁদা ও তহবিল ব্যবস্থাপনা</span>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
            চলতি মাস: নভেম্বর ২০২৬
          </span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          সদস্যদের নিয়মিত মাসিক সাবস্ক্রিপশন ট্র্যাকিং, ডিজিটাল চাঁদার রশিদ ও বকেয়া নোটিফিকেশন
        </p>
      </div>

      {/* Financial Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">মোট লক্ষ্যমাত্রা</span>
            <Wallet className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-2 tabular-nums">
            ৳{totalMonthlyTarget.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">সব সদস্যের নির্ধারিত মাসিক চাঁদা</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-emerald-600">
            <span className="text-xs font-semibold">আদায়কৃত চাঁদা</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <p className="text-2xl font-bold text-emerald-600 mt-2 tabular-nums">
            ৳{collectedAmount.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">{paidMembers.length} জন সদস্য পরিশোধ করেছেন</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-amber-600">
            <span className="text-xs font-semibold">বকেয়া চাঁদা</span>
            <Clock className="w-4 h-4" />
          </div>
          <p className="text-2xl font-bold text-amber-600 mt-2 tabular-nums">
            ৳{dueAmount.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">{dueMembers.length} জন সদস্যের চাঁদা বাকি</p>
        </div>
      </div>

      {/* Filter and Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="সদস্যের নাম বা ফোন দিয়ে খুঁজুন..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-auto text-xs">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                filter === 'all'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              সবাই ({members.length})
            </button>
            <button
              onClick={() => setFilter('paid')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                filter === 'paid'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              পরিশোধিত ({paidMembers.length})
            </button>
            <button
              onClick={() => setFilter('due')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                filter === 'due'
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              বকেয়া ({dueMembers.length})
            </button>
          </div>
        </div>

        {/* Members Payment Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold">
              <tr>
                <th className="py-3 px-4">সদস্যের নাম ও আইডি</th>
                <th className="py-3 px-4">পদবী</th>
                <th className="py-3 px-4">নির্ধারিত ফি</th>
                <th className="py-3 px-4">স্ট্যাটাস</th>
                <th className="py-3 px-4">অ্যাকশন / রশিদ</th>
                <th className="py-3 px-4 text-right">রিমাইন্ডার</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filtered.map((member) => (
                <tr key={member.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-8 h-8 rounded-full object-cover shrink-0"
                      />
                      <div>
                        <p className="font-bold text-slate-900 dark:text-slate-100">{member.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{member.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                    {member.role.split('(')[0].trim()}
                  </td>
                  <td className="py-3 px-4 font-semibold tabular-nums">
                    ৳{member.monthlyFee}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => onToggleStatus(member.id)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 ${
                        member.subscriptionStatus === 'paid'
                          ? 'bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-300 hover:bg-green-200'
                          : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 hover:bg-amber-200'
                      }`}
                      title="ক্লিক করে স্ট্যাটাস পরিবর্তন করুন"
                    >
                      {member.subscriptionStatus === 'paid' ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          পরিশোধিত
                        </>
                      ) : (
                        <>
                          <Clock className="w-3.5 h-3.5" />
                          বকেয়া (৳{member.monthlyFee})
                        </>
                      )}
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => setSelectedReceiptMember(member)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-800 border border-emerald-200 dark:border-emerald-800/60"
                    >
                      <Receipt className="w-3.5 h-3.5" />
                      রশিদ দেখুন
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {member.subscriptionStatus === 'due' ? (
                      <button
                        onClick={() => sendWhatsAppReminder(member)}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-[#25D366] hover:bg-[#20ba5a] text-slate-950 rounded-lg text-[11px] font-bold shadow-xs"
                      >
                        <Share2 className="w-3 h-3" />
                        তাগাদা পাঠান
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-400">সম্পন্ন</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Receipt Voucher Modal */}
      {selectedReceiptMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-emerald-800 text-white">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-amber-300" />
                <h3 className="font-bold text-sm">ডিজিটাল চাঁদার মানি রিসিপ্ট</h3>
              </div>
              <button
                onClick={() => setSelectedReceiptMember(null)}
                className="p-1 rounded-lg text-emerald-200 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Printable Receipt Paper */}
            <div className="p-6 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs">
              <div className="border border-slate-300 dark:border-slate-700 rounded-xl p-5 bg-white dark:bg-slate-900 shadow-sm space-y-4">
                <div className="text-center border-b border-slate-200 dark:border-slate-800 pb-3">
                  <h4 className="text-base font-extrabold text-emerald-800 dark:text-emerald-400">
                    {CLUB_INFO.nameBn}
                  </h4>
                  <p className="text-[10px] text-slate-500 font-mono">
                    রেজিস্ট্রেশন নং: {CLUB_INFO.registrationNo}
                  </p>
                  <p className="text-[10px] text-slate-400">{CLUB_INFO.address}</p>
                </div>

                <div className="flex justify-between items-center text-[11px] font-mono">
                  <span>রশিদ নং: CAS-RCP-2026-089</span>
                  <span>তারিখ: {new Date().toLocaleDateString('bn-BD')}</span>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">সদস্যের নাম:</span>
                    <span className="font-bold">{selectedReceiptMember.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">মেম্বার আইডি:</span>
                    <span className="font-mono">{selectedReceiptMember.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">পদবী:</span>
                    <span>{selectedReceiptMember.role.split('(')[0]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">চাঁদার মাস:</span>
                    <span>নভেম্বর ২০২৬</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-700 font-bold text-sm">
                    <span>জমাকৃত মোট টাকা:</span>
                    <span className="text-emerald-600">৳{selectedReceiptMember.monthlyFee}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500">পেমেন্ট অবস্থা:</span>
                    <span className="text-green-600 font-bold">
                      {selectedReceiptMember.subscriptionStatus === 'paid' ? 'পরিশোধিত' : 'বকেয়া'}
                    </span>
                  </div>
                </div>

                <div className="flex items-end justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
                  <div className="text-[10px] text-slate-400">
                    * এটি একটি কম্পিউটার জেনারেটেড রশিদ
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold italic text-slate-700 dark:text-slate-300">
                      সমীর রায়
                    </p>
                    <p className="text-[10px] text-slate-400">কোষাধ্যক্ষের স্বাক্ষর</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                প্রিন্ট করুন
              </button>
              <button
                onClick={() => {
                  alert('রশিদ ডাউনলোড সম্পন্ন!');
                  setSelectedReceiptMember(null);
                }}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl"
              >
                রশিদ সেভ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
