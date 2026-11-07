import React, { useState } from 'react';
import {
  PhoneCall,
  X,
  Search,
  Share2,
  Copy,
  PlusCircle,
  ShieldAlert,
  Ambulance,
  Flame,
  Shield,
  Heart,
  Trophy,
  Wallet,
  Sparkles,
  Check,
} from 'lucide-react';
import { EmergencyContact } from '../types/club';

interface EmergencyHelplineModalProps {
  isOpen: boolean;
  onClose: () => void;
  contacts: EmergencyContact[];
  onAddContact?: (contact: EmergencyContact) => void;
  onShareToChat?: (text: string) => void;
}

export const EmergencyHelplineModal: React.FC<EmergencyHelplineModalProps> = ({
  isOpen,
  onClose,
  contacts,
  onAddContact,
  onShareToChat,
}) => {
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newContact, setNewContact] = useState<Partial<EmergencyContact>>({
    title: '',
    situation: '',
    contactPerson: '',
    phone: '',
    availableTime: '২৪ ঘণ্টা',
    iconType: 'club',
  });

  if (!isOpen) return null;

  const handleCopy = (id: string, phone: string) => {
    navigator.clipboard.writeText(phone);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleShare = (c: EmergencyContact) => {
    const text = `🚨 *ক্লাব আনন্দ সংঘ জরুরি হেল্পলাইন*\n📞 *${c.title}*\nসিচুয়েশন: ${c.situation}\nদায়িত্বপ্রাপ্ত: ${c.contactPerson}\nফোন নম্বর: ${c.phone}\nসময়: ${c.availableTime}`;
    if (onShareToChat) {
      onShareToChat(text);
      onClose();
    } else {
      const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
      window.open(waUrl, '_blank');
    }
  };

  const handleSubmitNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContact.title || !newContact.phone || !onAddContact) return;

    onAddContact({
      id: `emg-${Date.now()}`,
      title: newContact.title,
      situation: newContact.situation || 'সাধারণ ক্লাব ও জরুরি যোগাযোগ',
      contactPerson: newContact.contactPerson || 'ক্লাব প্রতিনিধি',
      phone: newContact.phone,
      availableTime: newContact.availableTime || '২৪ ঘণ্টা',
      iconType: (newContact.iconType as any) || 'club',
    });

    setIsAddingNew(false);
    setNewContact({
      title: '',
      situation: '',
      contactPerson: '',
      phone: '',
      availableTime: '২৪ ঘণ্টা',
      iconType: 'club',
    });
  };

  const filtered = contacts.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.title.toLowerCase().includes(q) ||
      c.situation.toLowerCase().includes(q) ||
      c.contactPerson.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q)
    );
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'ambulance':
        return <Ambulance className="w-5 h-5 text-red-600" />;
      case 'police':
        return <Shield className="w-5 h-5 text-blue-600" />;
      case 'fire':
        return <Flame className="w-5 h-5 text-amber-600" />;
      case 'blood':
        return <Heart className="w-5 h-5 text-red-500" />;
      case 'sports':
        return <Trophy className="w-5 h-5 text-emerald-600" />;
      case 'chanda':
        return <Wallet className="w-5 h-5 text-teal-600" />;
      case 'puja':
        return <Sparkles className="w-5 h-5 text-purple-600" />;
      default:
        return <ShieldAlert className="w-5 h-5 text-emerald-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-red-700 via-rose-700 to-amber-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
              <PhoneCall className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-bold text-sm leading-tight">
                জরুরি সিচুয়েশন ও ক্লাব হেল্পলাইন ফোন নাম্বার
              </h3>
              <p className="text-[10px] text-rose-100">
                যেকোনো জরুরি মুহূর্তে সরাসরি যোগাযোগ ও সহায়তার জন্য
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-rose-200 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search and Action Bar */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="সিচুয়েশন (যেমন: রক্ত, অ্যাম্বুলেন্স, মাঠ, পূজা, পুলিশ) বা নাম খুঁজুন..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-red-500"
            />
          </div>

          <button
            onClick={() => setIsAddingNew(!isAddingNew)}
            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shrink-0"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>+ নতুন হেল্পলাইন</span>
          </button>
        </div>

        {/* Form to add new emergency contact */}
        {isAddingNew && (
          <form
            onSubmit={handleSubmitNew}
            className="p-4 bg-red-50/60 dark:bg-red-950/20 border-b border-red-200 dark:border-red-900/60 space-y-3 text-xs"
          >
            <h4 className="font-bold text-red-900 dark:text-red-300">
              নতুন সিচুয়েশন ফোন নাম্বার যুক্ত করুন
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <input
                type="text"
                required
                placeholder="হেল্পলাইনের নাম (যেমন: জল সরবরাহ / মাইক ইনচার্জ)"
                value={newContact.title}
                onChange={(e) => setNewContact({ ...newContact, title: e.target.value })}
                className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
              />
              <input
                type="tel"
                required
                placeholder="মোবাইল বা ফোন নম্বর"
                value={newContact.phone}
                onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <input
                type="text"
                placeholder="দায়িত্বপ্রাপ্ত ব্যক্তির নাম"
                value={newContact.contactPerson}
                onChange={(e) => setNewContact({ ...newContact, contactPerson: e.target.value })}
                className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
              />
              <input
                type="text"
                placeholder="সিচুয়েশন বিবরণ (যেমন: বিদ্যুৎ বিচ্ছিন্ন বা জরুরি জেনারেটর)"
                value={newContact.situation}
                onChange={(e) => setNewContact({ ...newContact, situation: e.target.value })}
                className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="px-3 py-1 rounded-lg text-slate-500 hover:bg-slate-200"
              >
                বাতিল
              </button>
              <button
                type="submit"
                className="px-4 py-1 bg-red-600 text-white font-semibold rounded-lg shadow-xs"
              >
                সংরক্ষণ করুন
              </button>
            </div>
          </form>
        )}

        {/* Contact List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5 divide-y divide-slate-100 dark:divide-slate-800">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="pt-2.5 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                  {getIcon(item.iconType)}
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {item.situation}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    দায়িত্বপ্রাপ্ত: <span className="font-medium text-slate-700 dark:text-slate-300">{item.contactPerson}</span> · {item.availableTime}
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
                {/* Phone Call */}
                <a
                  href={`tel:${item.phone.replace(/[^0-9+]/g, '')}`}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs transition-colors"
                  title="সরাসরি কল করুন"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>{item.phone}</span>
                </a>

                {/* Copy */}
                <button
                  onClick={() => handleCopy(item.id, item.phone)}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="নম্বর কপি করুন"
                >
                  {copiedId === item.id ? (
                    <Check className="w-3.5 h-3.5 text-green-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>

                {/* Share to chat / WhatsApp */}
                <button
                  onClick={() => handleShare(item)}
                  className="p-1.5 rounded-lg bg-[#25D366] text-slate-950 font-bold hover:bg-[#20ba5a] transition-colors"
                  title="চ্যাটে বা হোয়াটসঅ্যাপে শেয়ার করুন"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
