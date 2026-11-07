import React, { useState, useMemo } from 'react';
import {
  Search,
  UserPlus,
  Phone,
  MessageCircle,
  IdCard,
  Edit2,
  Trash2,
  Heart,
  Shield,
  MapPin,
  Calendar,
  Filter,
  Grid,
  List,
  CheckCircle2,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { Member, BloodGroup } from '../types/club';

interface MembersViewProps {
  members: Member[];
  onAddMemberClick: () => void;
  onEditMember: (member: Member) => void;
  onDeleteMember: (id: string) => void;
  onViewIdCard: (member: Member) => void;
  onOpenChatWithMember: (member: Member) => void;
}

const BLOOD_GROUPS: (BloodGroup | 'all')[] = ['all', 'A+', 'B+', 'O+', 'AB+', 'A-', 'B-', 'O-', 'AB-'];

export const MembersView: React.FC<MembersViewProps> = ({
  members,
  onAddMemberClick,
  onEditMember,
  onDeleteMember,
  onViewIdCard,
  onOpenChatWithMember,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleCategory, setSelectedRoleCategory] = useState<'all' | 'executive' | 'general' | 'life' | 'sports'>('all');
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<BloodGroup | 'all'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Filter logic
  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        member.name.toLowerCase().includes(q) ||
        member.nameEn.toLowerCase().includes(q) ||
        member.phone.toLowerCase().includes(q) ||
        member.id.toLowerCase().includes(q) ||
        member.address.toLowerCase().includes(q);

      if (!matchesSearch) return false;

      // Blood group filter
      if (selectedBloodGroup !== 'all' && member.bloodGroup !== selectedBloodGroup) {
        return false;
      }

      // Role filter
      if (selectedRoleCategory === 'executive') {
        return (
          member.role.includes('চেয়ারম্যান') ||
          member.role.includes('সভাপতি') ||
          member.role.includes('ম্যানেজমেন্ট') ||
          member.role.includes('পরিচালনা') ||
          member.role.includes('উদ্যোক্তা') ||
          member.role.includes('কমেডি') ||
          member.role.includes('সম্পাদক') ||
          member.role.includes('কোষাধ্যক্ষ') ||
          member.role.includes('কার্যনির্বাহী')
        );
      }
      if (selectedRoleCategory === 'general') {
        return member.role.includes('সাধারণ সদস্য');
      }
      if (selectedRoleCategory === 'life') {
        return member.role.includes('আজীবন সদস্য');
      }
      if (selectedRoleCategory === 'sports') {
        return member.role.includes('ক্রীড়া') || member.notes?.includes('ফুটবল') || member.notes?.includes('ক্যাপ্টেন');
      }

      return true;
    });
  }, [members, searchQuery, selectedRoleCategory, selectedBloodGroup]);

  // Statistics
  const totalCount = members.length;
  const paidCount = members.filter((m) => m.subscriptionStatus === 'paid').length;
  const volunteerCount = members.filter((m) => m.isVolunteer).length;
  const lifeCount = members.filter((m) => m.role.includes('আজীবন')).length;

  return (
    <div className="space-y-6">
      {/* Top Header & Stat Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>সদস্য তালিকা ও ব্যবস্থাপনা</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
              মোট: {totalCount} জন
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            ক্লাব আনন্দ সংঘের কর্মকর্তা, খেলোয়াড় ও সাধারণ সদস্যদের ডিজিটাল ডিরেক্টরি
          </p>
        </div>

        <button
          onClick={onAddMemberClick}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold shadow-md shadow-emerald-900/15 transition-all self-start md:self-auto shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ নতুন সদস্য নিবন্ধন করুন</span>
        </button>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500">মোট নিবন্ধিত সদস্য</p>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">{totalCount}</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-950/50 flex items-center justify-center text-green-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500">চাঁদা পরিশোধিত</p>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">{paidCount}</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-950/50 flex items-center justify-center text-red-500">
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500">রক্তদাতা ভলান্টিয়ার</p>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">{volunteerCount}</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600">
            <IdCard className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500">আজীবন সদস্য</p>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">{lifeCount}</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="সদস্যের নাম, ফোন নম্বর, মেম্বার আইডি বা পাড়া খুঁজুন..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* View toggle */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl self-end md:self-auto">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs transition-all ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
              title="গ্রিড ভিউ"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs transition-all ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
              title="টেবিল ভিউ"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Badges and Blood group selectors */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800/80">
          {/* Category Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-400 text-xs shrink-0 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> ক্যাটাগরি:
            </span>
            <button
              onClick={() => setSelectedRoleCategory('all')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors whitespace-nowrap ${
                selectedRoleCategory === 'all'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              সকল সদস্য ({members.length})
            </button>
            <button
              onClick={() => setSelectedRoleCategory('executive')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors whitespace-nowrap ${
                selectedRoleCategory === 'executive'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              পরিচালনা ও কমিটি ({members.filter(m => m.role.includes('চেয়ারম্যান') || m.role.includes('সভাপতি') || m.role.includes('ম্যানেজমেন্ট') || m.role.includes('উদ্যোক্তা') || m.role.includes('কমেডি') || m.role.includes('সম্পাদক') || m.role.includes('কোষাধ্যক্ষ')).length})
            </button>
            <button
              onClick={() => setSelectedRoleCategory('sports')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors whitespace-nowrap ${
                selectedRoleCategory === 'sports'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              ক্রীড়াদল
            </button>
            <button
              onClick={() => setSelectedRoleCategory('general')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors whitespace-nowrap ${
                selectedRoleCategory === 'general'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              সাধারণ সদস্য
            </button>
            <button
              onClick={() => setSelectedRoleCategory('life')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors whitespace-nowrap ${
                selectedRoleCategory === 'life'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              আজীবন সদস্য
            </button>
          </div>

          {/* Blood Group Filter (Emergency donor search) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs shrink-0">
            <span className="text-slate-400 text-xs shrink-0 flex items-center gap-1 mr-1">
              <Heart className="w-3 h-3 text-red-500" /> রক্তের গ্রুপ:
            </span>
            {BLOOD_GROUPS.map((bg) => (
              <button
                key={bg}
                onClick={() => setSelectedBloodGroup(bg)}
                className={`px-2 py-0.5 rounded-md font-semibold text-[11px] transition-colors shrink-0 ${
                  selectedBloodGroup === bg
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {bg === 'all' ? 'সব গ্রুপ' : bg}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Members Listing */}
      {filteredMembers.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
          <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">কোন সদস্য পাওয়া যায়নি</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            আপনার অনুসন্ধান বা ফিল্টারের সাথে মিলে এমন কোনো সদস্য তালিকাভুক্ত নেই। সার্চ ক্লিয়ার করুন অথবা নতুন সদস্য যুক্ত করুন।
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedRoleCategory('all');
              setSelectedBloodGroup('all');
            }}
            className="mt-4 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl"
          >
            ফিল্টার রিসেট করুন
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-lg transition-all flex flex-col justify-between group"
            >
              {/* Card Header & Avatar */}
              <div className="p-5">
                <div className="flex items-start gap-3.5">
                  <div className="relative shrink-0">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-600/40 shadow-sm"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-md shadow">
                      {member.bloodGroup}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded truncate">
                        {member.role.split('(')[0].trim()}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{member.id}</span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-1 truncate">
                      {member.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {member.nameEn}
                    </p>
                  </div>
                </div>

                {/* Info List */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{member.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{member.address}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                      <Calendar className="w-3 h-3" />
                      <span>যুক্ত: {member.joinDate}</span>
                    </div>
                    <div>
                      {member.subscriptionStatus === 'paid' ? (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-300 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> চাঁদা পরিশোধিত
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> বকেয়া: ৳{member.monthlyFee}
                        </span>
                      )}
                    </div>
                  </div>

                  {member.notes && (
                    <p className="text-[11px] text-slate-500 italic mt-1 line-clamp-1">
                      "{member.notes}"
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {/* Phone Call */}
                  <a
                    href={`tel:${member.phone.replace(/\s+/g, '')}`}
                    className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-slate-700 transition-colors"
                    title="ফোন কল করুন"
                  >
                    <Phone className="w-4 h-4" />
                  </a>

                  {/* WhatsApp Chat */}
                  <button
                    onClick={() => onOpenChatWithMember(member)}
                    className="p-2 rounded-xl text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-slate-700 transition-colors"
                    title="হোয়াটসঅ্যাপে মেসেজ পাঠান"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </button>

                  {/* ID Card Modal */}
                  <button
                    onClick={() => onViewIdCard(member)}
                    className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-slate-700 transition-colors"
                    title="ডিজিটাল আইডি কার্ড দেখুন"
                  >
                    <IdCard className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onEditMember(member)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    title="তথ্য সম্পাদনা"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteMember(member.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors flex items-center gap-1"
                    title="সদস্য মুছে ফেলুন (Delete)"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-500" />
                    <span className="text-[10px] text-red-600 dark:text-red-400 font-medium hidden group-hover:inline">মুছে ফেলুন</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold">
                <tr>
                  <th className="py-3 px-4">মেম্বার আইডি ও নাম</th>
                  <th className="py-3 px-4">পদবী</th>
                  <th className="py-3 px-4">রক্তের গ্রুপ</th>
                  <th className="py-3 px-4">যোগাযোগ</th>
                  <th className="py-3 px-4">ঠিকানা</th>
                  <th className="py-3 px-4">চাঁদা অবস্থা</th>
                  <th className="py-3 px-4 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-9 h-9 rounded-xl object-cover shrink-0"
                        />
                        <div>
                          <p className="font-bold text-slate-900 dark:text-slate-100">{member.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{member.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-emerald-800 dark:text-emerald-300">
                        {member.role.split('(')[0].trim()}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-red-600 bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded text-[11px]">
                        {member.bloodGroup}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <p>{member.phone}</p>
                      <p className="text-[10px] text-slate-400">{member.email}</p>
                    </td>
                    <td className="py-3 px-4 max-w-[150px] truncate">{member.address}</td>
                    <td className="py-3 px-4">
                      {member.subscriptionStatus === 'paid' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-green-700 dark:text-green-400">
                          <CheckCircle2 className="w-3.5 h-3.5" /> পরিশোধিত
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                          <Clock className="w-3.5 h-3.5" /> বকেয়া (৳{member.monthlyFee})
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => onViewIdCard(member)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-slate-800"
                          title="আইডি কার্ড"
                        >
                          <IdCard className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onOpenChatWithMember(member)}
                          className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-slate-800"
                          title="চ্যাট"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onEditMember(member)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                          title="এডিট"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteMember(member.id)}
                          className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                          title="মুছে ফেলুন (Delete)"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
