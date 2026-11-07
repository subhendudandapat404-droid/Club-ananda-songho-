import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  BellRing,
  PlusCircle,
  Share2,
  Check,
  AlertCircle,
  Trophy,
  Heart,
  Theater,
  Briefcase,
  X,
  Volume2,
} from 'lucide-react';
import { ClubEvent, EventCategory, ClubNotification } from '../types/club';

interface EventsViewProps {
  events: ClubEvent[];
  onRsvp: (eventId: string, status: 'going' | 'maybe' | 'declined') => void;
  onAddEvent: (event: ClubEvent, alsoNotify: boolean) => void;
  onBroadcastNotification: (title: string, message: string, type: 'event' | 'emergency' | 'meeting') => void;
}

export const EventsView: React.FC<EventsViewProps> = ({
  events,
  onRsvp,
  onAddEvent,
  onBroadcastNotification,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | 'all'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [copiedEventId, setCopiedEventId] = useState<string | null>(null);

  // New Event Form State
  const [newEvent, setNewEvent] = useState({
    title: '',
    category: 'sports' as EventCategory,
    date: '2026-12-10',
    time: 'বিকাল ৪:০০ টা',
    location: 'আনন্দ সংঘ মেইন গ্রাউন্ড',
    description: '',
    organizer: 'সাধারণ সম্পাদক',
    isUrgentNotice: true,
    sendNotification: true,
  });

  const filteredEvents = events.filter((e) => {
    if (selectedCategory === 'all') return true;
    return e.category === selectedCategory;
  });

  const featuredEvent = events[0];

  const handleShareWhatsApp = (evt: ClubEvent) => {
    const text = `📢 *ক্লাব আনন্দ সংঘ ইভেন্ট বিজ্ঞপ্তি*\n🏆 *${evt.title}*\n📅 তারিখ: ${evt.date}\n⏰ সময়: ${evt.time}\n📍 স্থান: ${evt.location}\n\n${evt.description}\n\nসদস্যদের উপস্থিত থাকার জন্য অনুরোধ জানানো হচ্ছে।`;
    navigator.clipboard.writeText(text);
    setCopiedEventId(evt.id);
    setTimeout(() => setCopiedEventId(null), 2500);

    // If on mobile/desktop with whatsapp support, open whatsapp share link
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title.trim()) return;

    const eventItem: ClubEvent = {
      id: `EVT-${Date.now()}`,
      title: newEvent.title,
      category: newEvent.category,
      date: newEvent.date,
      time: newEvent.time,
      location: newEvent.location,
      image:
        newEvent.category === 'sports'
          ? '/src/assets/images/football_event_banner_1794060028709.jpg'
          : newEvent.category === 'social'
          ? '/src/assets/images/blood_donation_camp_1794060027892.jpg'
          : '/src/assets/images/club_hero_gathering_1794060026993.jpg',
      description: newEvent.description || 'ক্লাব আনন্দ সংঘের সম্মানিত সকল সদস্য ও শুভানুধ্যায়ীদের সদয় উপস্থিতি কামনা করা হচ্ছে।',
      organizer: newEvent.organizer,
      rsvpCount: { going: 1, maybe: 0, declined: 0 },
      userRsvp: 'going',
      isUrgentNotice: newEvent.isUrgentNotice,
    };

    onAddEvent(eventItem, newEvent.sendNotification);
    setIsAddModalOpen(false);
    setNewEvent({
      title: '',
      category: 'sports',
      date: '2026-12-10',
      time: 'বিকাল ৪:০০ টা',
      location: 'আনন্দ সংঘ মেইন গ্রাউন্ড',
      description: '',
      organizer: 'সাধারণ সম্পাদক',
      isUrgentNotice: true,
      sendNotification: true,
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>ক্লাবের ইভেন্ট ও নোটিফিকেশন</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
              {events.length} টি সক্রিয় ইভেন্ট
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            খেলাধুলা, রক্তদান শিবির, সাংস্কৃতিক অনুষ্ঠান ও ক্লাবের জরুরি সাধারণ সভার নোটিশ বোর্ড
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              onBroadcastNotification(
                '📢 ক্লাবের জরুরি বিশেষ নোটিশ',
                'সকল সদস্যকে ক্লাব ভবনে আগামী রবিবার সকাল ১০টায় প্রয়োজনীয় সাংগঠনিক আলোচনায় উপস্থিত থাকতে অনুরোধ করা হচ্ছে।',
                'emergency'
              );
            }}
            className="px-3 py-2 rounded-xl text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 flex items-center gap-1.5 transition-colors"
            title="সকল সদস্যদের নোটিফিকেশন পাঠান"
          >
            <BellRing className="w-3.5 h-3.5" />
            <span>জরুরি নোটিশ ব্রডকাস্ট</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold shadow-md shadow-emerald-900/15 flex items-center gap-1.5 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ নতুন ইভেন্ট ঘোষণা</span>
          </button>
        </div>
      </div>

      {/* Featured Event Banner */}
      {featuredEvent && (
        <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 bg-slate-900 text-white">
          <div className="h-64 sm:h-80 w-full relative">
            <img
              src={featuredEvent.image}
              alt={featuredEvent.title}
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          </div>

          <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                আসন্ন প্রধান ইভেন্ট
              </span>
              <span className="text-xs text-amber-300 font-semibold flex items-center gap-1">
                <BellRing className="w-3.5 h-3.5" /> নোটিফিকেশন সক্রিয়
              </span>
            </div>

            <h3 className="text-xl sm:text-3xl font-extrabold text-white leading-tight max-w-2xl">
              {featuredEvent.title}
            </h3>

            <p className="text-xs sm:text-sm text-slate-200 mt-2 line-clamp-2 max-w-2xl leading-relaxed">
              {featuredEvent.description}
            </p>

            {/* Meta Row */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-300 mt-4">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span>{featuredEvent.date}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>{featuredEvent.time}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>{featuredEvent.location}</span>
              </div>
              <div className="flex items-center gap-1.5 text-amber-300 font-medium">
                <Users className="w-4 h-4" />
                <span>{featuredEvent.rsvpCount.going} জন সদস্য যাচ্ছেন</span>
              </div>
            </div>

            {/* RSVP & WhatsApp Share Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 mt-5 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-300 font-semibold">আপনার উপস্থিতি:</span>
                <button
                  onClick={() => onRsvp(featuredEvent.id, 'going')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                    featuredEvent.userRsvp === 'going'
                      ? 'bg-emerald-500 text-white shadow-md'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  যাচ্ছি ({featuredEvent.rsvpCount.going})
                </button>
                <button
                  onClick={() => onRsvp(featuredEvent.id, 'maybe')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    featuredEvent.userRsvp === 'maybe'
                      ? 'bg-amber-500 text-white shadow-md'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  হয়তো ({featuredEvent.rsvpCount.maybe})
                </button>
                <button
                  onClick={() => onRsvp(featuredEvent.id, 'declined')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    featuredEvent.userRsvp === 'declined'
                      ? 'bg-red-500 text-white shadow-md'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  না ({featuredEvent.rsvpCount.declined})
                </button>
              </div>

              <button
                onClick={() => handleShareWhatsApp(featuredEvent)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#25D366] hover:bg-[#20ba5a] text-slate-950 flex items-center gap-1.5 transition-all shadow-md"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copiedEventId === featuredEvent.id ? 'কপি ও শেয়ার্ড!' : 'হোয়াটসঅ্যাপে শেয়ার'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
            selectedCategory === 'all'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          সব ইভেন্ট ও মিটিং ({events.length})
        </button>
        <button
          onClick={() => setSelectedCategory('sports')}
          className={`px-3 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap flex items-center gap-1 ${
            selectedCategory === 'sports'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          <Trophy className="w-3.5 h-3.5 text-emerald-500" />
          খেলাধুলা ও টুর্নামেন্ট
        </button>
        <button
          onClick={() => setSelectedCategory('social')}
          className={`px-3 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap flex items-center gap-1 ${
            selectedCategory === 'social'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          <Heart className="w-3.5 h-3.5 text-red-500" />
          রক্তদান ও সমাজসেবা
        </button>
        <button
          onClick={() => setSelectedCategory('meeting')}
          className={`px-3 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap flex items-center gap-1 ${
            selectedCategory === 'meeting'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5 text-blue-500" />
          সাধারণ সভা ও অধিবেশন
        </button>
        <button
          onClick={() => setSelectedCategory('cultural')}
          className={`px-3 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap flex items-center gap-1 ${
            selectedCategory === 'cultural'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          <Theater className="w-3.5 h-3.5 text-purple-500" />
          সাংস্কৃতিক সন্ধ্যা ও উৎসব
        </button>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredEvents.map((evt) => (
          <div
            key={evt.id}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="h-44 w-full relative overflow-hidden">
                <img
                  src={evt.image}
                  alt={evt.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute top-3 left-3">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-950/70 text-white backdrop-blur-xs">
                    {evt.category === 'sports'
                      ? 'খেলাধুলা'
                      : evt.category === 'social'
                      ? 'রক্তদান ও সমাজসেবা'
                      : evt.category === 'meeting'
                      ? 'সাধারণ সভা'
                      : 'সাংস্কৃতিক'}
                  </span>
                </div>
                {evt.isUrgentNotice && (
                  <div className="absolute top-3 right-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-red-600 text-white shadow-xs flex items-center gap-1">
                      <BellRing className="w-3 h-3" /> জরুরি নোটিশ
                    </span>
                  </div>
                )}
              </div>

              <div className="p-4">
                <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-snug">
                  {evt.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {evt.description}
                </p>

                <div className="mt-4 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{evt.date}</span>
                    <span className="text-slate-400">·</span>
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{evt.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{evt.location}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 italic">আহ্বায়ক: {evt.organizer}</p>
                </div>
              </div>
            </div>

            {/* Card Footer: RSVP & Share */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onRsvp(evt.id, 'going')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
                    evt.userRsvp === 'going'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <Check className="w-3 h-3" />
                  যাচ্ছি ({evt.rsvpCount.going})
                </button>
                <button
                  onClick={() => onRsvp(evt.id, 'maybe')}
                  className={`px-2 py-1 rounded-lg text-xs transition-colors ${
                    evt.userRsvp === 'maybe'
                      ? 'bg-amber-600 text-white'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  হয়তো
                </button>
              </div>

              <button
                onClick={() => handleShareWhatsApp(evt)}
                className="p-1.5 rounded-lg text-[#25D366] hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors"
                title="হোয়াটসঅ্যাপে শেয়ার করুন"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Event Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-emerald-800 text-white">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <h3 className="font-bold text-base">নতুন ক্লাব ইভেন্ট ও নোটিফিকেশন তৈরি</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-emerald-200 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  ইভেন্ট বা নোটিশের শিরোনাম <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  placeholder="যেমন: বাৎসরিক ক্যারাম ও দাবা প্রতিযোগিতা"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    ক্যাটাগরি
                  </label>
                  <select
                    value={newEvent.category}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, category: e.target.value as EventCategory })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs"
                  >
                    <option value="sports">খেলাধুলা (Sports)</option>
                    <option value="social">রক্তদান ও সমাজসেবা (Social)</option>
                    <option value="cultural">সাংস্কৃতিক (Cultural)</option>
                    <option value="meeting">সাধারণ সভা (Meeting)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    তারিখ
                  </label>
                  <input
                    type="date"
                    required
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    সময়
                  </label>
                  <input
                    type="text"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                    placeholder="যেমন: বিকাল ৪:০০ টা"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    আহ্বায়ক / দায়িত্বপ্রাপ্ত
                  </label>
                  <input
                    type="text"
                    value={newEvent.organizer}
                    onChange={(e) => setNewEvent({ ...newEvent, organizer: e.target.value })}
                    placeholder="যেমন: অনির্বাণ চক্রবর্তী (সম্পাদক)"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  স্থান / ভেন্যু
                </label>
                <input
                  type="text"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                  placeholder="যেমন: আনন্দ সংঘ ক্লাব অডিটোরিয়াম"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  বিস্তারিত বিবরণ
                </label>
                <textarea
                  rows={3}
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  placeholder="ইভেন্টের বিস্তারিত তথ্য ও নির্দেশনাবলী..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs"
                />
              </div>

              {/* Notification Toggle checkbox */}
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-center gap-3">
                <input
                  type="checkbox"
                  id="sendNotif"
                  checked={newEvent.sendNotification}
                  onChange={(e) => setNewEvent({ ...newEvent, sendNotification: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
                <label htmlFor="sendNotif" className="font-semibold text-emerald-900 dark:text-emerald-200 text-xs cursor-pointer">
                  📢 প্রকাশের সাথে সাথে সকল সদস্যদের অ্যাপে নোটিফিকেশন এলার্ট পাঠান
                </label>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl font-medium text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold text-white bg-emerald-700 hover:bg-emerald-800 shadow-md"
                >
                  ইভেন্ট প্রকাশ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
