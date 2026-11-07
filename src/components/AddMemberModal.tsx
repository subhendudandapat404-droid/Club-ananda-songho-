import React, { useState } from 'react';
import { X, UserPlus, Phone, Mail, MapPin, Heart, Shield, Check } from 'lucide-react';
import { Member, MemberRole, BloodGroup } from '../types/club';

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMember: (member: Member) => void;
  initialData?: Member | null;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
];

const ROLES: MemberRole[] = [
  'চেয়ারম্যান (Chairman)',
  'সভাপতি (President)',
  'সহ-সভাপতি (Vice President)',
  'ম্যানেজমেন্ট ও পরিচালনা (Management & Steering)',
  'প্রধান উদ্যোক্তা (Chief Initiator / Organizer)',
  'কমেডি ও বিনোদন কমিটি (Comedy & Entertainment)',
  'সাধারণ সম্পাদক (General Secretary)',
  'যুগ্ম সম্পাদক (Joint Secretary)',
  'কোষাধ্যক্ষ (Treasurer)',
  'ক্রীড়া সম্পাদক (Sports Secretary)',
  'সাংস্কৃতিক সম্পাদক (Cultural Secretary)',
  'কার্যনির্বাহী সদস্য (Executive Member)',
  'সাধারণ সদস্য (General Member)',
  'আজীবন সদস্য (Life Member)',
];

const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const AddMemberModal: React.FC<AddMemberModalProps> = ({
  isOpen,
  onClose,
  onAddMember,
  initialData,
}) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    nameEn: initialData?.nameEn || '',
    role: initialData?.role || ('সাধারণ সদস্য (General Member)' as MemberRole),
    phone: initialData?.phone || '',
    email: initialData?.email || '',
    bloodGroup: initialData?.bloodGroup || ('B+' as BloodGroup),
    address: initialData?.address || '',
    joinDate: initialData?.joinDate || new Date().toISOString().split('T')[0],
    monthlyFee: initialData?.monthlyFee || 100,
    subscriptionStatus: initialData?.subscriptionStatus || ('paid' as 'paid' | 'due'),
    avatar: initialData?.avatar || PRESET_AVATARS[0],
    emergencyContact: initialData?.emergencyContact || '',
    isVolunteer: initialData?.isVolunteer ?? true,
    notes: initialData?.notes || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'সদস্যের নাম বাংলায় লিখুন';
    if (!formData.phone.trim()) errs.phone = 'ফোন নম্বর আবশ্যক';
    if (!formData.address.trim()) errs.address = 'ঠিকানা বা পাড়া উল্লেখ করুন';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const newMember: Member = {
      id: initialData?.id || `CAS-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      name: formData.name,
      nameEn: formData.nameEn || formData.name,
      role: formData.role,
      phone: formData.phone.startsWith('+91') ? formData.phone : `+91 ${formData.phone}`,
      email: formData.email || `${formData.name.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      bloodGroup: formData.bloodGroup,
      address: formData.address,
      joinDate: formData.joinDate,
      subscriptionStatus: formData.subscriptionStatus,
      monthlyFee: Number(formData.monthlyFee) || 100,
      avatar: formData.avatar,
      emergencyContact: formData.emergencyContact || formData.phone,
      isVolunteer: formData.isVolunteer,
      notes: formData.notes,
    };

    onAddMember(newMember);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-emerald-800 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center text-white">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold leading-tight">
                {initialData ? 'সদস্য তথ্য সম্পাদনা' : 'নতুন সদস্য নিবন্ধন'}
              </h2>
              <p className="text-xs text-emerald-200">ক্লাব আনন্দ সংঘ · রেজিস্ট্রেশন ফর্ম</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-700/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          {/* Avatar selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              প্রোফাইল ছবি নির্বাচন করুন
            </label>
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {PRESET_AVATARS.map((url, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setFormData({ ...formData, avatar: url })}
                  className={`relative w-12 h-12 rounded-full overflow-hidden border-2 transition-all shrink-0 ${
                    formData.avatar === url
                      ? 'border-emerald-600 scale-105 shadow-md ring-2 ring-emerald-500/30'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={url} alt="avatar option" className="w-full h-full object-cover" />
                  {formData.avatar === url && (
                    <div className="absolute inset-0 bg-emerald-900/40 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Name & English Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                পূর্ণ নাম (বাংলায়) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="যেমন: অনির্বাণ চক্রবর্তী"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
                  errors.name ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'
                }`}
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Name (in English)
              </label>
              <input
                type="text"
                value={formData.nameEn}
                onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                placeholder="e.g. Anirban Chakraborty"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              />
            </div>
          </div>

          {/* Phone & Emergency Contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                মোবাইল নম্বর <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="98315 44556"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
                  errors.phone ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'
                }`}
              />
              {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-emerald-600" />
                ইমেল ঠিকানা
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="anirban@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              />
            </div>
          </div>

          {/* Role & Blood Group */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                ক্লাবের পদবী / ভূমিকা <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as MemberRole })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-red-500" />
                রক্তের গ্রুপ (Blood Group) <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.bloodGroup}
                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value as BloodGroup })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
              >
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Address & Emergency Contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                বাসস্থান / পাড়া <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="যেমন: ১৫ শরৎ পল্লী, উত্তর পাড়া"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  errors.address ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                জরুরি যোগাযোগের ফোন নম্বর
              </label>
              <input
                type="tel"
                value={formData.emergencyContact}
                onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                placeholder="যেমন: ৯৮৩১৫ ১১২২৩"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Monthly Fee & Subscription status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                মাসিক চাঁদা (টাকা)
              </label>
              <input
                type="number"
                min="0"
                step="50"
                value={formData.monthlyFee}
                onChange={(e) => setFormData({ ...formData, monthlyFee: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                চলতি মাসের চাঁদার অবস্থা
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, subscriptionStatus: 'paid' })}
                  className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${
                    formData.subscriptionStatus === 'paid'
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  পরিশোধিত (Paid)
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, subscriptionStatus: 'due' })}
                  className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${
                    formData.subscriptionStatus === 'due'
                      ? 'bg-amber-600 text-white border-amber-600'
                      : 'border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  বকেয়া (Due)
                </button>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              মন্তব্য / বিশেষ দায়িত্ব (ঐচ্ছিক)
            </label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="যেমন: রক্তদান শিবিরের স্বেচ্ছাসেবক, ফুটবল দলের সদস্য..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Buttons */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 shadow-md shadow-emerald-900/20 transition-all flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              {initialData ? 'তথ্য সংরক্ষণ করুন' : 'নিবন্ধন সম্পন্ন করুন'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
