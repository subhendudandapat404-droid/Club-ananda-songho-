import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Paperclip,
  Smile,
  Mic,
  MicOff,
  Image as ImageIcon,
  CheckCheck,
  Search,
  Phone,
  Video,
  MoreVertical,
  Reply,
  Volume2,
  VolumeX,
  Play,
  Pause,
  AlertTriangle,
  FileText,
  Heart,
  ThumbsUp,
  PartyPopper,
  Flame,
  X,
  Users,
  PhoneCall,
  Sparkles,
} from 'lucide-react';
import { Conversation, ChatMessage, Member } from '../types/club';

interface WhatsAppChatViewProps {
  conversations: Conversation[];
  messages: Record<string, ChatMessage[]>;
  activeConversationId: string;
  onSelectConversation: (id: string) => void;
  onSendMessage: (conversationId: string, text: string, options?: Partial<ChatMessage>) => void;
  members: Member[];
  onOpenHelpline?: () => void;
}

export const WhatsAppChatView: React.FC<WhatsAppChatViewProps> = ({
  conversations,
  messages,
  activeConversationId,
  onSelectConversation,
  onSendMessage,
  members,
  onOpenHelpline,
}) => {
  const [inputText, setInputText] = useState('');
  const [searchConv, setSearchConv] = useState('');
  const [convFilter, setConvFilter] = useState<'all' | 'groups' | 'direct'>('all');
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [voiceSeconds, setVoiceSeconds] = useState(0);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [audioProgress, setAudioProgress] = useState(0);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isPartnerTyping, setIsPartnerTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recordTimerRef = useRef<any>(null);

  const activeConv = conversations.find((c) => c.id === activeConversationId) || conversations[0];
  const currentMessages = messages[activeConv?.id] || [];

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages.length, isPartnerTyping]);

  // Voice recording timer simulation
  useEffect(() => {
    if (isRecordingVoice) {
      setVoiceSeconds(0);
      recordTimerRef.current = setInterval(() => {
        setVoiceSeconds((s) => s + 1);
      }, 1000);
    } else {
      clearInterval(recordTimerRef.current);
    }
    return () => clearInterval(recordTimerRef.current);
  }, [isRecordingVoice]);

  // Filter conversations
  const filteredConversations = conversations.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchConv.toLowerCase());
    if (!matchesSearch) return false;
    if (convFilter === 'groups') return c.type === 'group' || c.type === 'channel';
    if (convFilter === 'direct') return c.type === 'direct';
    return true;
  });

  const handleSend = (textInputOverride?: string) => {
    const textToSend = (textInputOverride || inputText).trim();
    if (!textToSend) return;
    setInputText('');
    const replyContext = replyingTo
      ? {
          id: replyingTo.id,
          senderName: replyingTo.senderName,
          text: replyingTo.text,
        }
      : undefined;

    setReplyingTo(null);
    setShowEmojiPicker(false);
    setShowAttachMenu(false);

    onSendMessage(activeConv.id, textToSend, {
      replyTo: replyContext,
    });

    // Intelligent scenario-aware club responses with situation phone numbers
    if (activeConv.id === 'conv-main' || activeConv.id === 'conv-sports' || activeConv.id === 'conv-president' || activeConv.id.startsWith('conv-member')) {
      setTimeout(() => {
        setIsPartnerTyping(true);
      }, 700);

      setTimeout(() => {
        setIsPartnerTyping(false);
        const lower = textToSend.toLowerCase();

        let responder = {
          name: 'অনির্বাণ চক্রবর্তী',
          role: 'সাধারণ সম্পাদক',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
          text: 'ধন্যবাদ আপনার মূল্যবান বার্তার জন্য! আমরা ক্লাব কার্যনির্বাহী সভায় এটি আলোচনা করব। জরুরি প্রয়োজনে আমার নম্বরে সরাসরি কল করতে পারেন: 📞 +91 98315 44556।',
        };

        if (lower.includes('রক্ত') || lower.includes('blood') || lower.includes('হাসপাতাল') || lower.includes('রোগী')) {
          responder = {
            name: 'আকাশ মণ্ডল',
            role: 'সহ-সভাপতি ও রক্তদান সেল',
            avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
            text: 'জরুরি রক্তের সিচুয়েশনে আমাদের ব্লাড সেল হেল্পলাইনে এখনই কল করুন: 📞 +91 97482 11223। ক্লাবের ভলান্টিয়ার তালিকা দেখে তৎক্ষণাৎ রক্তদাতার ব্যবস্থা করা হচ্ছে!',
          };
        } else if (lower.includes('ফুটবল') || lower.includes('খেলা') || lower.includes('ম্যাচ') || lower.includes('জার্সি') || lower.includes('মাঠ')) {
          responder = {
            name: 'দেবজিৎ দত্ত',
            role: 'ক্রীড়া সম্পাদক',
            avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
            text: 'মাঠের প্রস্তুতি একদম চূড়ান্ত! কাল বিকাল ৪টায় প্রীতি ম্যাচ ও জার্সি ট্রায়াল হবে। বিস্তারিত জানতে আমাকে কল করুন: 📞 +91 98741 88990!',
          };
        } else if (lower.includes('পূজা') || lower.includes('কালী') || lower.includes('আলোকসজ্জা') || lower.includes('মণ্ডপ') || lower.includes('ভোগ')) {
          responder = {
            name: 'তন্ময় ঘোষাল',
            role: 'প্রধান উদ্যোক্তা',
            avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
            text: 'জয় মা কালী! মণ্ডপ ও চন্দননগরের বিশেষ আলোর কাজ চলছে। পূজা সেলের জরুরি নম্বর: 📞 +91 98311 33445। সকল সদস্যকে সন্ধ্যায় মণ্ডপে আসার আমন্ত্রণ রইল!',
          };
        } else if (lower.includes('নাটক') || lower.includes('কমেডি') || lower.includes('গান') || lower.includes('সাংস্কৃতিক') || lower.includes('হাসি')) {
          responder = {
            name: 'সন্তু দে (কমেডিয়ান)',
            role: 'কমেডি ও বিনোদন সেল',
            avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
            text: 'হা হা! রিহার্সাল খুব জমে উঠেছে ভাই! এবারের কমেডি ড্রামায় দুর্দান্ত কমেডি পাঞ্চলাইন থাকছে। স্ক্রিপ্ট পেতে আমাকে কল করবেন: 📞 +91 91633 55667!',
          };
        } else if (lower.includes('চাঁদা') || lower.includes('টাকা') || lower.includes('রশিদ') || lower.includes('হিসাব') || lower.includes('বাজেট')) {
          responder = {
            name: 'সমীর রায়',
            role: 'কোষাধ্যক্ষ',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
            text: 'চলতি নভেম্বর মাসের চাঁদার রশিদ প্রস্তুত আছে। প্রতিদিন সন্ধ্যা ৭টায় ক্লাব ঘরে জমা দিতে পারেন বা যোগাযোগ করুন: 📞 +91 94330 66778।',
          };
        } else if (lower.includes('জরুরি') || lower.includes('ফোন') || lower.includes('হেল্পলাইন') || lower.includes('নম্বর') || lower.includes('অ্যাম্বুলেন্স')) {
          responder = {
            name: 'দীপক মজুমদার',
            role: 'ম্যানেজমেন্ট ও কন্ট্রোল রুম',
            avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
            text: '🚨 জরুরি সিচুয়েশন ফোন নম্বরসমূহ:\n• কন্ট্রোল রুম: 📞 +91 98320 88776\n• রক্তদান সেল: 📞 +91 97482 11223\n• অ্যাম্বুলেন্স: 📞 102 / +91 98300 00102\n• থানা: 📞 100',
          };
        }

        onSendMessage(activeConv.id, responder.text, {
          isMe: false,
          senderName: responder.name,
          senderRole: responder.role,
          senderAvatar: responder.avatar,
        });
      }, 2000);
    }
  };

  const handleVoiceSend = () => {
    setIsRecordingVoice(false);
    onSendMessage(activeConv.id, 'ভয়েস অডিও বার্তা', {
      mediaType: 'voice',
      voiceDuration: `0:${voiceSeconds < 10 ? '0' : ''}${voiceSeconds}`,
    });
  };

  const sendPresetAttachment = (type: 'photo' | 'notice' | 'blood') => {
    setShowAttachMenu(false);
    if (type === 'photo') {
      onSendMessage(activeConv.id, '📷 ক্লাবের নতুন ফুটবল মাঠের প্রস্তুতি ছবি', {
        mediaType: 'image',
        mediaUrl: '/src/assets/images/football_event_banner_1794060028709.jpg',
      });
    } else if (type === 'notice') {
      onSendMessage(
        activeConv.id,
        '📢 জরুরি বিজ্ঞপ্তি: আগামী রবিবারের মাসিক চাঁদা সংগ্রহ ও সাধারণ সভা সংক্রান্ত নোটিশ জারি করা হলো।',
        {
          mediaType: 'notice',
        }
      );
    } else if (type === 'blood') {
      onSendMessage(
        activeConv.id,
        '🩸 জরুরি রক্তের আবেদন: স্থানীয় সরকারি হাসপাতালের জন্য জরুরি ভিত্তিতে O+ বা B+ রক্ত প্রয়োজন। যে কেউ আগ্রহী হলে দ্রুত ইনবক্স করুন।',
        {
          mediaType: 'notice',
        }
      );
    }
  };

  const addReaction = (messageId: string, emoji: string) => {
    // In our chat messages state, update the reactions
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl flex flex-col md:flex-row h-[720px]">
      {/* LEFT SIDEBAR: WhatsApp Conversations List */}
      <div className="w-full md:w-80 lg:w-96 border-r border-slate-200 dark:border-slate-800 flex flex-col bg-slate-50/70 dark:bg-slate-950/70 shrink-0">
        {/* WhatsApp Top Green Header on Sidebar */}
        <div className="p-3.5 bg-emerald-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center text-white font-bold text-xs">
              CAS
            </div>
            <div>
              <h3 className="font-bold text-sm leading-tight">আনন্দ সংঘ চ্যাট</h3>
              <p className="text-[10px] text-emerald-200">হোয়াটসঅ্যাপ কমিউনিটি</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => alert('সদস্যদের ব্রডকাস্ট গ্রুপ চালু আছে')}
              className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-700/60"
              title="নতুন গ্রুপ"
            >
              <Users className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-2.5 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchConv}
              onChange={(e) => setSearchConv(e.target.value)}
              placeholder="চ্যাট বা বার্তা খুঁজুন..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 mt-2">
            <button
              onClick={() => setConvFilter('all')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                convFilter === 'all'
                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
              }`}
            >
              সব চ্যাট
            </button>
            <button
              onClick={() => setConvFilter('groups')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                convFilter === 'groups'
                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
              }`}
            >
              গ্রুপ ও নোটিশ
            </button>
            <button
              onClick={() => setConvFilter('direct')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                convFilter === 'direct'
                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
              }`}
            >
              ব্যক্তিগত
            </button>
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto chat-scroll divide-y divide-slate-100 dark:divide-slate-800/60">
          {filteredConversations.map((conv) => {
            const isActive = conv.id === activeConv.id;
            return (
              <div
                key={conv.id}
                onClick={() => onSelectConversation(conv.id)}
                className={`p-3 cursor-pointer flex items-center gap-3 transition-colors ${
                  isActive
                    ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-l-4 border-emerald-600'
                    : 'hover:bg-slate-100/70 dark:hover:bg-slate-800/40'
                }`}
              >
                <div className="relative shrink-0">
                  <img
                    src={conv.avatar}
                    alt={conv.name}
                    className="w-11 h-11 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                  />
                  {conv.isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                      {conv.name}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-mono shrink-0 ml-1">
                      {conv.lastTime}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate flex-1">
                      {conv.lastMessage}
                    </p>
                    {conv.unreadCount > 0 && (
                      <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT CHAT WINDOW */}
      <div className="flex-1 flex flex-col h-full bg-[#efeae2] dark:bg-[#0b141a] relative">
        {/* WhatsApp Top Header */}
        <div className="px-4 py-2.5 bg-emerald-800 text-white flex items-center justify-between shrink-0 shadow-sm z-10">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative shrink-0">
              <img
                src={activeConv.avatar}
                alt={activeConv.name}
                className="w-10 h-10 rounded-full object-cover border border-emerald-600"
              />
              {activeConv.isOnline && (
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-emerald-800" />
              )}
            </div>

            <div className="min-w-0">
              <h3 className="text-sm font-bold truncate leading-tight">{activeConv.name}</h3>
              <p className="text-[11px] text-emerald-200 truncate">
                {isPartnerTyping ? (
                  <span className="text-amber-300 font-medium animate-pulse">টাইপ করছেন...</span>
                ) : activeConv.type === 'group' ? (
                  `${activeConv.membersCount || 45} জন সদস্য · সক্রিয় ক্লাব গ্রুপ`
                ) : activeConv.type === 'channel' ? (
                  'অফিসিয়াল ব্রডকাস্ট নোটিশ চ্যানেল'
                ) : activeConv.isOnline ? (
                  'অনলাইন'
                ) : (
                  'সর্বশেষ দেখা আজ সকালে'
                )}
              </p>
            </div>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-1.5 text-emerald-100">
            {onOpenHelpline && (
              <button
                onClick={onOpenHelpline}
                className="px-2.5 py-1 rounded-xl bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold flex items-center gap-1 shadow-xs transition-colors shrink-0"
                title="জরুরি সিচুয়েশন ফোন নাম্বার"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">জরুরি হেল্পলাইন</span>
              </button>
            )}
            <button
              onClick={() => alert(`কল করা হচ্ছে: ${activeConv.name}`)}
              className="p-1.5 rounded-full hover:bg-emerald-700/80 transition-colors"
              title="অডিও কল"
            >
              <Phone className="w-4 h-4" />
            </button>
            <button
              onClick={() => alert(`ভিডিও কল শুরু হচ্ছে: ${activeConv.name}`)}
              className="p-1.5 rounded-full hover:bg-emerald-700/80 transition-colors"
              title="ভিডিও কল"
            >
              <Video className="w-4 h-4" />
            </button>
            <button
              onClick={() => alert('ক্লাব ইনফো ও মেম্বার তালিকা')}
              className="p-1.5 rounded-full hover:bg-emerald-700/80 transition-colors"
              title="মেনু"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Message Thread Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 chat-scroll">
          {/* Date banner */}
          <div className="text-center my-2">
            <span className="bg-white/80 dark:bg-slate-800/80 text-[10px] text-slate-600 dark:text-slate-300 px-3 py-1 rounded-md shadow-xs uppercase tracking-wider font-semibold">
              আজ · ক্লাব আনন্দ সংঘ বার্তা
            </span>
          </div>

          {currentMessages.map((msg) => {
            const isMe = msg.isMe;
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} group relative`}
              >
                {/* Bubble Container */}
                <div
                  className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-3.5 py-2 shadow-xs text-xs relative ${
                    isMe
                      ? 'bg-[#d9fdd3] dark:bg-[#005c4b] text-slate-900 dark:text-slate-100 rounded-tr-none'
                      : 'bg-white dark:bg-[#202c33] text-slate-900 dark:text-slate-100 rounded-tl-none border border-slate-100 dark:border-slate-800/40'
                  }`}
                >
                  {/* Sender Name in Group Chat */}
                  {!isMe && activeConv.type !== 'direct' && (
                    <div className="flex items-center gap-1.5 mb-1 pb-1 border-b border-slate-100 dark:border-slate-700/50">
                      <span className="font-bold text-[11px] text-emerald-700 dark:text-emerald-400">
                        {msg.senderName}
                      </span>
                      {msg.senderRole && (
                        <span className="text-[9px] bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-1.5 py-0.2 rounded font-medium">
                          {msg.senderRole}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Quoted Reply context */}
                  {msg.replyTo && (
                    <div className="mb-1.5 p-2 rounded-lg bg-black/5 dark:bg-white/5 border-l-2 border-emerald-600 text-[11px] text-slate-600 dark:text-slate-300">
                      <p className="font-semibold text-emerald-700 dark:text-emerald-400">
                        {msg.replyTo.senderName}
                      </p>
                      <p className="truncate text-[10px]">{msg.replyTo.text}</p>
                    </div>
                  )}

                  {/* Media Content */}
                  {msg.mediaType === 'image' && msg.mediaUrl && (
                    <div className="mb-2 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                      <img src={msg.mediaUrl} alt="media" className="w-full max-h-48 object-cover" />
                    </div>
                  )}

                  {msg.mediaType === 'voice' && (
                    <div className="flex items-center gap-3 py-1 pr-2">
                      <button
                        onClick={() => {
                          setPlayingAudioId(playingAudioId === msg.id ? null : msg.id);
                        }}
                        className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 hover:bg-emerald-700 transition-colors"
                      >
                        {playingAudioId === msg.id ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4 ml-0.5" />
                        )}
                      </button>
                      <div className="flex-1 min-w-[120px]">
                        <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-emerald-600 transition-all ${
                              playingAudioId === msg.id ? 'w-3/4 animate-pulse' : 'w-1/3'
                            }`}
                          />
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
                          <span>{playingAudioId === msg.id ? 'বাজছে...' : 'ভয়েস অডিও'}</span>
                          <span>{msg.voiceDuration || '0:18'}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {msg.mediaType === 'notice' && (
                    <div className="mb-1.5 p-2 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-amber-800 dark:text-amber-300 text-[11px]">
                          জরুরি ক্লাব বুলেটিন
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Message Text */}
                  <p className="whitespace-pre-wrap leading-relaxed text-[12.5px]">{msg.text}</p>

                  {/* Timestamp & Status */}
                  <div className="flex items-center justify-end gap-1 text-[10px] text-slate-400 mt-1">
                    <span>{msg.timestamp}</span>
                    {isMe && (
                      <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb] ml-0.5" />
                    )}
                  </div>

                  {/* Quick Reactions Badges */}
                  {msg.reactions && msg.reactions.length > 0 && (
                    <div className="absolute -bottom-2 right-2 flex items-center gap-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full px-1.5 py-0.5 shadow-xs">
                      {msg.reactions.map((r, i) => (
                        <span key={i} className="text-[10px] flex items-center gap-0.5">
                          <span>{r.emoji}</span>
                          <span className="font-mono text-[9px] text-slate-500">{r.count}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Hover Reply Trigger */}
                <button
                  onClick={() => setReplyingTo(msg)}
                  className={`opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full text-slate-400 hover:text-emerald-700 hover:bg-white/80 dark:hover:bg-slate-800 text-[10px] flex items-center gap-1 mt-0.5 ${
                    isMe ? 'mr-1' : 'ml-1'
                  }`}
                  title="উত্তর দিন (Reply)"
                >
                  <Reply className="w-3 h-3" />
                  <span>রিপ্লাই</span>
                </button>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isPartnerTyping && (
            <div className="flex items-center gap-2 p-2 bg-white dark:bg-slate-800 rounded-xl w-32 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce delay-100" />
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce delay-200" />
              <span className="text-[10px] text-slate-400">টাইপিং...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Replying banner */}
        {replyingTo && (
          <div className="px-4 py-2 bg-emerald-50 dark:bg-emerald-950/60 border-t border-emerald-200 dark:border-emerald-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs">
              <Reply className="w-3.5 h-3.5 text-emerald-600" />
              <div>
                <p className="font-bold text-emerald-800 dark:text-emerald-300 text-[11px]">
                  রিপ্লাই করছেন: {replyingTo.senderName}
                </p>
                <p className="text-[10px] text-slate-500 truncate max-w-md">{replyingTo.text}</p>
              </div>
            </div>
            <button
              onClick={() => setReplyingTo(null)}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Attachment Popup Menu */}
        {showAttachMenu && (
          <div className="absolute bottom-16 left-6 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-2 space-y-1 z-30 animate-in fade-in slide-in-from-bottom-2 duration-150">
            <button
              onClick={() => sendPresetAttachment('photo')}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950/50 flex items-center justify-center text-blue-600">
                <ImageIcon className="w-4 h-4" />
              </div>
              <span>ক্লাবের ছবি পাঠান</span>
            </button>

            <button
              onClick={() => sendPresetAttachment('notice')}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center text-amber-600">
                <FileText className="w-4 h-4" />
              </div>
              <span>অফিসিয়াল নোটিশ জারি</span>
            </button>

            <button
              onClick={() => sendPresetAttachment('blood')}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-red-100 dark:bg-red-950/50 flex items-center justify-center text-red-600">
                <Heart className="w-4 h-4" />
              </div>
              <span>জরুরি রক্তের আবেদন</span>
            </button>
            <button
              onClick={() => {
                setShowAttachMenu(false);
                if (onOpenHelpline) onOpenHelpline();
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600">
                <PhoneCall className="w-4 h-4" />
              </div>
              <span>জরুরি সিচুয়েশন ফোন নম্বর</span>
            </button>
          </div>
        )}

        {/* Emoji Quick Picker */}
        {showEmojiPicker && (
          <div className="absolute bottom-16 left-12 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-3 z-30 grid grid-cols-6 gap-2">
            {['👍', '❤️', '👏', '⚽', '🩸', '🎉', '🏆', '🙏', '🔥', '✨', '🤝', '😊'].map((emoji) => (
              <button
                key={emoji}
                onClick={() => {
                  setInputText((prev) => prev + emoji);
                  setShowEmojiPicker(false);
                }}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-base"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        {/* Quick Situation Conversation Starters */}
        <div className="flex items-center gap-1.5 overflow-x-auto px-3 py-1.5 bg-slate-200/90 dark:bg-[#111b21] border-t border-slate-300 dark:border-slate-800 text-[11px] shrink-0">
          <span className="text-slate-500 dark:text-slate-400 font-bold shrink-0 flex items-center gap-1 text-[10px]">
            <Sparkles className="w-3 h-3 text-amber-500" /> সিচুয়েশন:
          </span>
          <button
            onClick={() => handleSend('⚽ ফুটবল টুর্নামেন্টের মাঠ প্রস্তুতি ও জার্সি ট্রায়াল কবে?')}
            className="px-2.5 py-0.5 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-emerald-50 dark:hover:bg-slate-700 whitespace-nowrap font-medium text-[10.5px] transition-colors"
          >
            ⚽ ফুটবল প্রস্তুতি
          </button>
          <button
            onClick={() => handleSend('🪔 শ্যামাপূজা ও আলোকসজ্জা মণ্ডপের বাজেট ও আয়োজন কেমন?')}
            className="px-2.5 py-0.5 rounded-full bg-white dark:bg-slate-800 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800 hover:bg-amber-50 dark:hover:bg-slate-700 whitespace-nowrap font-medium text-[10.5px] transition-colors"
          >
            🪔 শ্যামাপূজা আপডেট
          </button>
          <button
            onClick={() => handleSend('🩸 জরুরি রক্তের প্রয়োজন! ক্লাবের ব্লাড সেল হেল্পলাইন নম্বর দিন।')}
            className="px-2.5 py-0.5 rounded-full bg-white dark:bg-slate-800 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-900 hover:bg-red-50 dark:hover:bg-slate-700 whitespace-nowrap font-medium text-[10.5px] transition-colors"
          >
            🩸 রক্তের হেল্পলাইন
          </button>
          <button
            onClick={() => handleSend('🎭 সন্তু দা, কমেডি নাটকের পরবর্তী রিহার্সাল কবে?')}
            className="px-2.5 py-0.5 rounded-full bg-white dark:bg-slate-800 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-slate-700 whitespace-nowrap font-medium text-[10.5px] transition-colors"
          >
            🎭 কমেডি নাটক মহড়া
          </button>
          <button
            onClick={() => handleSend('💳 নভেম্বর মাসের মাসিক চাঁদা জমা ও রশিদ সংগ্রহ সংক্রান্ত তথ্য')}
            className="px-2.5 py-0.5 rounded-full bg-white dark:bg-slate-800 text-teal-700 dark:text-teal-300 border border-teal-300 dark:border-teal-800 hover:bg-teal-50 dark:hover:bg-slate-700 whitespace-nowrap font-medium text-[10.5px] transition-colors"
          >
            💳 চাঁদার রশিদ
          </button>
          {onOpenHelpline && (
            <button
              onClick={onOpenHelpline}
              className="px-2.5 py-0.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold whitespace-nowrap text-[10.5px] transition-colors flex items-center gap-1 shadow-xs"
            >
              <PhoneCall className="w-3 h-3" />
              <span>জরুরি ফোন নম্বর</span>
            </button>
          )}
        </div>

        {/* WhatsApp Bottom Input Bar */}
        <div className="p-3 bg-slate-100 dark:bg-[#202c33] border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 shrink-0">
          {/* Emoji button */}
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2 text-slate-500 hover:text-emerald-700 dark:hover:text-emerald-400 rounded-full transition-colors"
            title="ইমোজি"
          >
            <Smile className="w-5 h-5" />
          </button>

          {/* Paperclip attach button */}
          <button
            onClick={() => setShowAttachMenu(!showAttachMenu)}
            className={`p-2 rounded-full transition-colors ${
              showAttachMenu
                ? 'text-emerald-700 bg-emerald-100 dark:bg-emerald-950'
                : 'text-slate-500 hover:text-emerald-700 dark:hover:text-emerald-400'
            }`}
            title="ফাইল বা ছবি সংযুক্ত করুন"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          {/* Input or Voice Recording Bar */}
          {isRecordingVoice ? (
            <div className="flex-1 bg-red-50 dark:bg-red-950/50 rounded-xl px-4 py-2 flex items-center justify-between border border-red-200 dark:border-red-900 animate-pulse">
              <div className="flex items-center gap-2 text-red-600 text-xs font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
                <span>ভয়েস রেকর্ড হচ্ছে... (0:{voiceSeconds < 10 ? '0' : ''}{voiceSeconds})</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsRecordingVoice(false)}
                  className="text-xs text-slate-500 hover:text-slate-800 font-medium"
                >
                  বাতিল
                </button>
                <button
                  onClick={handleVoiceSend}
                  className="px-3 py-1 rounded-lg bg-red-600 text-white text-xs font-semibold"
                >
                  পাঠান
                </button>
              </div>
            </div>
          ) : (
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSend();
                }
              }}
              placeholder="একটি বার্তা লিখুন (যেমন: টুর্নামেন্টের প্রস্তুতি কেমন?)..."
              className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            />
          )}

          {/* Send or Voice Record Button */}
          {inputText.trim() ? (
            <button
              onClick={() => handleSend()}
              className="w-10 h-10 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-md shadow-emerald-900/20 transition-all active:scale-95 shrink-0"
              title="মেসেজ পাঠান"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          ) : (
            <button
              onClick={() => setIsRecordingVoice(!isRecordingVoice)}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shrink-0 ${
                isRecordingVoice
                  ? 'bg-red-600 text-white shadow-md shadow-red-900/30'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-900/20'
              }`}
              title="ভয়েস রেকর্ড"
            >
              {isRecordingVoice ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
