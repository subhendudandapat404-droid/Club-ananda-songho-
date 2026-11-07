import React, { useState, useRef } from 'react';
import {
  Image as ImageIcon,
  Video,
  PlusCircle,
  Play,
  Heart,
  Share2,
  Download,
  Trash2,
  Eye,
  Calendar,
  User,
  Filter,
  Search,
  X,
  Upload,
  Film,
  Sparkles,
  Check,
} from 'lucide-react';
import { MediaItem, MediaType, MediaCategory } from '../types/club';

interface GalleryViewProps {
  mediaItems: MediaItem[];
  onAddMedia: (item: MediaItem) => void;
  onDeleteMedia: (id: string) => void;
  onToggleLike: (id: string) => void;
}

const CATEGORIES: { id: MediaCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'সব অ্যালবাম' },
  { id: 'kali_puja', label: '🪔 কালীপূজা ও উৎসব' },
  { id: 'sports', label: '⚽ ফুটবল ও খেলাধুলা' },
  { id: 'cultural', label: '🎭 সাংস্কৃতিক ও কমেডি' },
  { id: 'social', label: '🩸 রক্তদান ও সমাজসেবা' },
  { id: 'reunion', label: '👥 পুনর্মিলন ও পিকনিক' },
];

export const GalleryView: React.FC<GalleryViewProps> = ({
  mediaItems,
  onAddMedia,
  onDeleteMedia,
  onToggleLike,
}) => {
  const [selectedType, setSelectedType] = useState<'all' | 'image' | 'video'>('all');
  const [selectedCategory, setSelectedCategory] = useState<MediaCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [activeVideoItem, setActiveVideoItem] = useState<MediaItem | null>(null);
  const [activePhotoItem, setActivePhotoItem] = useState<MediaItem | null>(null);
  const [deletingMediaId, setDeletingMediaId] = useState<string | null>(null);

  // New Media Form state
  const [newMedia, setNewMedia] = useState<{
    title: string;
    type: MediaType;
    category: MediaCategory;
    url: string;
    videoUrl: string;
    duration: string;
    description: string;
    uploadedBy: string;
    filePreview: string | null;
  }>({
    title: '',
    type: 'image',
    category: 'kali_puja',
    url: '',
    videoUrl: '',
    duration: '০৩:০০',
    description: '',
    uploadedBy: 'ক্লাব সদস্য',
    filePreview: null,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle local file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setNewMedia((prev) => ({
          ...prev,
          url: result,
          videoUrl: prev.type === 'video' ? result : '',
          filePreview: result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit new media
  const handleSaveMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedia.title.trim()) return;

    // Use default sample image or video if none provided
    const fallbackImage =
      newMedia.category === 'kali_puja'
        ? '/src/assets/images/kali_puja_pandal_1794061999726.jpg'
        : newMedia.category === 'sports'
        ? '/src/assets/images/football_event_banner_1794060028709.jpg'
        : newMedia.category === 'cultural'
        ? '/src/assets/images/cultural_stage_drama_1794061999624.jpg'
        : '/src/assets/images/club_hero_gathering_1794060026993.jpg';

    const finalUrl = newMedia.url.trim() || newMedia.filePreview || fallbackImage;

    const item: MediaItem = {
      id: `media-${Date.now()}`,
      title: newMedia.title,
      type: newMedia.type,
      category: newMedia.category,
      url: finalUrl,
      thumbnail: newMedia.type === 'video' ? fallbackImage : finalUrl,
      videoUrl:
        newMedia.type === 'video'
          ? newMedia.videoUrl.trim() ||
            'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
          : undefined,
      duration: newMedia.type === 'video' ? newMedia.duration || '০২:৩০' : undefined,
      date: new Date().toISOString().split('T')[0],
      uploadedBy: newMedia.uploadedBy || 'ক্লাব সদস্য',
      description: newMedia.description,
      likes: 1,
      isUserLiked: true,
    };

    onAddMedia(item);
    setIsUploadModalOpen(false);
    setNewMedia({
      title: '',
      type: 'image',
      category: 'kali_puja',
      url: '',
      videoUrl: '',
      duration: '০৩:০০',
      description: '',
      uploadedBy: 'ক্লাব সদস্য',
      filePreview: null,
    });
  };

  // Filter items
  const filteredItems = mediaItems.filter((item) => {
    if (selectedType !== 'all' && item.type !== selectedType) return false;
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.uploadedBy.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const photoCount = mediaItems.filter((m) => m.type === 'image').length;
  const videoCount = mediaItems.filter((m) => m.type === 'video').length;

  const handleShareWhatsApp = (item: MediaItem) => {
    const text = `📸 *ক্লাব আনন্দ সংঘ গ্যালারি*\n🏆 *${item.title}*\n${item.type === 'video' ? '🎥 ভিডিও' : '📷 ছবি'}\nআহ্বায়ক: ${item.uploadedBy}\n\nক্লাব আনন্দ সংঘ অ্যাপে বিস্তারিত দেখুন।`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>ফটো ও ভিডিও গ্যালারি</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
              মোট: {mediaItems.length} টি স্মৃতি
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            ক্লাব আনন্দ সংঘের শ্যামাপূজা, ফুটবল টুর্নামেন্ট, রক্তদান শিবির ও নাটকের স্মরণীয় মুহূর্তের ভিডিও ও ছবি সংরক্ষণাগার
          </p>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-900/15 transition-all self-start md:self-auto shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ নতুন ছবি বা ভিডিও সেভ করুন</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Media Type Toggle */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl self-start">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                selectedType === 'all'
                  ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              সব মিডিয়া ({mediaItems.length})
            </button>
            <button
              onClick={() => setSelectedType('image')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                selectedType === 'image'
                  ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5 text-blue-500" />
              ছবি ({photoCount})
            </button>
            <button
              onClick={() => setSelectedType('video')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                selectedType === 'video'
                  ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Video className="w-3.5 h-3.5 text-red-500" />
              ভিডিও ({videoCount})
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ছবি বা ভিডিও খুঁজুন..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs pt-1 border-t border-slate-100 dark:border-slate-800">
          <span className="text-slate-400 text-xs shrink-0 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> অ্যালবাম:
          </span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors whitespace-nowrap shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Media Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
          <Film className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            কোনো ছবি বা ভিডিও পাওয়া যায়নি
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            আপনার পছন্দের ক্যাটাগরিতে নতুন ছবি বা ভিডিও যোগ করতে ওপরের বাটনটি চাপুন।
          </p>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="mt-4 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl"
          >
            + ছবি বা ভিডিও সেভ করুন
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => {
            const isVideo = item.type === 'video';
            const displayImg = item.thumbnail || item.url;

            return (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                {/* Media Image / Video Preview */}
                <div
                  onClick={() => {
                    if (isVideo) {
                      setActiveVideoItem(item);
                    } else {
                      setActivePhotoItem(item);
                    }
                  }}
                  className="relative h-52 w-full overflow-hidden bg-slate-950 cursor-pointer"
                >
                  <img
                    src={displayImg}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                  {/* Video Play Badge overlay */}
                  {isVideo && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-red-600/90 hover:bg-red-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 ml-1 fill-white" />
                      </div>
                    </div>
                  )}

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-xs text-white">
                      {item.category === 'kali_puja'
                        ? 'কালীপূজা'
                        : item.category === 'sports'
                        ? 'খেলাধুলা'
                        : item.category === 'cultural'
                        ? 'সাংস্কৃতিক'
                        : item.category === 'social'
                        ? 'সমাজসেবা'
                        : 'পুনর্মিলন'}
                    </span>
                    {isVideo && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-red-600 text-white flex items-center gap-1">
                        <Video className="w-3 h-3" />
                        ভিডিও
                      </span>
                    )}
                  </div>

                  {/* Duration badge for videos */}
                  {isVideo && item.duration && (
                    <div className="absolute bottom-3 right-3 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-black/80 text-white">
                      {item.duration}
                    </div>
                  )}

                  {!isVideo && (
                    <div className="absolute bottom-3 right-3 text-[10px] font-semibold px-2 py-0.5 rounded bg-black/60 text-white flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      বড় করে দেখুন
                    </div>
                  )}
                </div>

                {/* Content body */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 leading-snug line-clamp-1 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-1 truncate max-w-[150px]">
                      <User className="w-3 h-3 shrink-0" />
                      <span className="truncate">{item.uploadedBy}</span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Calendar className="w-3 h-3 shrink-0" />
                      <span>{item.date}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {/* Like button */}
                    <button
                      onClick={() => onToggleLike(item.id)}
                      className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg transition-colors ${
                        item.isUserLiked
                          ? 'text-red-600 bg-red-50 dark:bg-red-950/40'
                          : 'text-slate-500 hover:text-red-600 hover:bg-slate-200/50'
                      }`}
                      title="পছন্দ করুন"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${item.isUserLiked ? 'fill-red-600' : ''}`}
                      />
                      <span className="tabular-nums">{item.likes}</span>
                    </button>

                    {/* WhatsApp Share */}
                    <button
                      onClick={() => handleShareWhatsApp(item)}
                      className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-slate-700 transition-colors"
                      title="হোয়াটসঅ্যাপে শেয়ার করুন"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Direct Download if image */}
                    {!isVideo && (
                      <a
                        href={item.url}
                        download={`ananda-sangha-${item.id}.jpg`}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        title="ছবি ডাউনলোড করুন"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={() => setDeletingMediaId(item.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                    title="মুছে ফেলুন (Delete)"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* UPLOAD & SAVE MODAL */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-emerald-800 text-white">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-amber-300" />
                <h3 className="font-bold text-sm">নতুন ছবি বা ভিডিও সেভ করুন</h3>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1 rounded-lg text-emerald-200 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveMedia} className="p-5 overflow-y-auto space-y-4 text-xs">
              {/* Type Switcher */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  মিডিয়া টাইপ নির্বাচন করুন
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewMedia({ ...newMedia, type: 'image' })}
                    className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 border transition-all ${
                      newMedia.type === 'image'
                        ? 'bg-emerald-700 text-white border-emerald-700'
                        : 'border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <ImageIcon className="w-4 h-4" />
                    ছবি (Photo)
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewMedia({ ...newMedia, type: 'video' })}
                    className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 border transition-all ${
                      newMedia.type === 'video'
                        ? 'bg-red-600 text-white border-red-600'
                        : 'border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Video className="w-4 h-4" />
                    ভিডিও (Video)
                  </button>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  শিরোনাম / ক্যাপশন <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newMedia.title}
                  onChange={(e) => setNewMedia({ ...newMedia, title: e.target.value })}
                  placeholder="যেমন: শ্যামাপূজার আলোকসজ্জা মণ্ডপ ২০২৪"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs"
                />
              </div>

              {/* Category & Duration */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    ক্যাটাগরি
                  </label>
                  <select
                    value={newMedia.category}
                    onChange={(e) =>
                      setNewMedia({ ...newMedia, category: e.target.value as MediaCategory })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs"
                  >
                    <option value="kali_puja">কালীপূজা ও উৎসব</option>
                    <option value="sports">ফুটবল ও খেলাধুলা</option>
                    <option value="cultural">সাংস্কৃতিক ও কমেডি</option>
                    <option value="social">রক্তদান ও সমাজসেবা</option>
                    <option value="reunion">পুনর্মিলন ও পিকনিক</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    আপলোডকারী / দায়িত্বপ্রাপ্ত
                  </label>
                  <input
                    type="text"
                    value={newMedia.uploadedBy}
                    onChange={(e) => setNewMedia({ ...newMedia, uploadedBy: e.target.value })}
                    placeholder="যেমন: তন্ময় ঘোষাল"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs"
                  />
                </div>
              </div>

              {/* File upload from device */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  ডিভাইস থেকে ফাইল নির্বাচন করুন
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept={newMedia.type === 'video' ? 'video/*' : 'image/*'}
                  onChange={handleFileChange}
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 dark:file:bg-emerald-950 file:text-emerald-700 dark:file:text-emerald-300 hover:file:bg-emerald-100 cursor-pointer"
                />

                {/* Preview if uploaded */}
                {newMedia.filePreview && (
                  <div className="mt-2 relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 h-28 bg-black">
                    {newMedia.type === 'video' ? (
                      <video
                        src={newMedia.filePreview}
                        controls
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <img
                        src={newMedia.filePreview}
                        alt="preview"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                )}
              </div>

              {/* Or Media URL link */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  অথবা সরাসরি মিডিয়া/ভিডিও লিংক দিন (ঐচ্ছিক)
                </label>
                <input
                  type="url"
                  value={newMedia.type === 'video' ? newMedia.videoUrl : newMedia.url}
                  onChange={(e) => {
                    if (newMedia.type === 'video') {
                      setNewMedia({ ...newMedia, videoUrl: e.target.value, url: e.target.value });
                    } else {
                      setNewMedia({ ...newMedia, url: e.target.value });
                    }
                  }}
                  placeholder="https://example.com/video.mp4 বা ছবির লিংক..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs"
                />
              </div>

              {newMedia.type === 'video' && (
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    ভিডিওর সময়কাল (Duration)
                  </label>
                  <input
                    type="text"
                    value={newMedia.duration}
                    onChange={(e) => setNewMedia({ ...newMedia, duration: e.target.value })}
                    placeholder="যেমন: ০৩:৪৫"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs"
                  />
                </div>
              )}

              {/* Description */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  সংক্ষিপ্ত বিবরণ (Description)
                </label>
                <textarea
                  rows={2}
                  value={newMedia.description}
                  onChange={(e) => setNewMedia({ ...newMedia, description: e.target.value })}
                  placeholder="ছবি বা ভিডিও সম্পর্কিত বিশেষ মুহূর্ত..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs"
                />
              </div>

              {/* Action buttons */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl font-medium text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold text-white bg-emerald-700 hover:bg-emerald-800 shadow-md flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  গ্যালারিতে সেভ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FULLSCREEN VIDEO PLAYER MODAL */}
      {activeVideoItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-black rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col">
            {/* Top Bar */}
            <div className="p-4 flex items-center justify-between text-white border-b border-slate-800 bg-slate-900/80">
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-red-500" />
                <h3 className="font-bold text-sm truncate max-w-md">{activeVideoItem.title}</h3>
              </div>
              <button
                onClick={() => setActiveVideoItem(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player */}
            <div className="relative aspect-video w-full bg-black flex items-center justify-center">
              <video
                src={activeVideoItem.videoUrl || activeVideoItem.url}
                poster={activeVideoItem.thumbnail}
                controls
                autoPlay
                className="w-full h-full object-contain"
              >
                আপনার ব্রাউজার ভিডিওটি চালাতে সক্ষম নয়।
              </video>
            </div>

            {/* Video Details & Meta */}
            <div className="p-5 bg-slate-900 text-white space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="font-bold text-base text-slate-100">{activeVideoItem.title}</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    ধারণকারী: {activeVideoItem.uploadedBy} · তারিখ: {activeVideoItem.date} · সময়কাল: {activeVideoItem.duration || '০৩:০০'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onToggleLike(activeVideoItem.id)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold ${
                      activeVideoItem.isUserLiked
                        ? 'bg-red-600 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <Heart
                      className={`w-4 h-4 ${activeVideoItem.isUserLiked ? 'fill-white' : ''}`}
                    />
                    <span className="tabular-nums">{activeVideoItem.likes}</span>
                  </button>

                  <button
                    onClick={() => handleShareWhatsApp(activeVideoItem)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#25D366] text-slate-950 flex items-center gap-1"
                  >
                    <Share2 className="w-4 h-4" />
                    শেয়ার
                  </button>
                </div>
              </div>

              {activeVideoItem.description && (
                <p className="text-xs text-slate-300 leading-relaxed border-t border-slate-800 pt-3">
                  {activeVideoItem.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* FULLSCREEN PHOTO LIGHTBOX MODAL */}
      {activePhotoItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-slate-900 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col max-h-[90vh]">
            {/* Top Bar */}
            <div className="p-4 flex items-center justify-between text-white border-b border-slate-800">
              <h3 className="font-bold text-sm truncate max-w-md">{activePhotoItem.title}</h3>
              <button
                onClick={() => setActivePhotoItem(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Photo Container */}
            <div className="flex-1 overflow-hidden bg-black flex items-center justify-center p-2">
              <img
                src={activePhotoItem.url}
                alt={activePhotoItem.title}
                className="max-h-[65vh] w-auto object-contain rounded-lg"
              />
            </div>

            {/* Details Footer */}
            <div className="p-4 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-800">
              <div>
                <p className="text-xs text-slate-400">
                  {activePhotoItem.uploadedBy} · {activePhotoItem.date}
                </p>
                {activePhotoItem.description && (
                  <p className="text-xs text-slate-300 mt-1 max-w-lg line-clamp-2">
                    {activePhotoItem.description}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onToggleLike(activePhotoItem.id)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold ${
                    activePhotoItem.isUserLiked
                      ? 'bg-red-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 ${activePhotoItem.isUserLiked ? 'fill-white' : ''}`}
                  />
                  <span className="tabular-nums">{activePhotoItem.likes}</span>
                </button>

                <a
                  href={activePhotoItem.url}
                  download={`ananda-sangha-${activePhotoItem.id}.jpg`}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1"
                >
                  <Download className="w-4 h-4" />
                  ডাউনলোড
                </a>

                <button
                  onClick={() => handleShareWhatsApp(activePhotoItem)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#25D366] text-slate-950 flex items-center gap-1"
                >
                  <Share2 className="w-4 h-4" />
                  শেয়ার
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingMediaId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md p-6 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
              ছবি বা ভিডিও মুছে ফেলতে চান?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
              আপনি কি নিশ্চিত যে এই ফাইলটি ক্লাব আনন্দ সংঘ গ্যালারি থেকে স্থায়ীভাবে মুছে ফেলতে চান?
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setDeletingMediaId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                বাতিল
              </button>
              <button
                onClick={() => {
                  onDeleteMedia(deletingMediaId);
                  setDeletingMediaId(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 shadow-md"
              >
                হ্যাঁ, মুছে ফেলুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
