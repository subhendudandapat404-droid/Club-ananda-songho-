/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  INITIAL_MEMBERS,
  INITIAL_EVENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_CONVERSATIONS,
  INITIAL_MESSAGES,
  INITIAL_GALLERY_ITEMS,
  EMERGENCY_SITUATION_CONTACTS,
  CLUB_INFO,
} from './data/initialData';
import {
  Member,
  ClubEvent,
  ClubNotification,
  Conversation,
  ChatMessage,
  MediaItem,
  EmergencyContact,
} from './types/club';
import { Navbar } from './components/Navbar';
import { MembersView } from './components/MembersView';
import { WhatsAppChatView } from './components/WhatsAppChatView';
import { GalleryView } from './components/GalleryView';
import { EventsView } from './components/EventsView';
import { ChandaView } from './components/ChandaView';
import { AddMemberModal } from './components/AddMemberModal';
import { MemberIdCardModal } from './components/MemberIdCardModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { EmergencyHelplineModal } from './components/EmergencyHelplineModal';
import {
  Check,
  AlertCircle,
  Info,
  Heart,
  Phone,
  Mail,
  MapPin,
  PhoneCall,
  Sparkles,
} from 'lucide-react';

export default function App() {
  // Persistence state
  const [members, setMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem('cas_members_v3');
    return saved ? JSON.parse(saved) : INITIAL_MEMBERS;
  });

  const [events, setEvents] = useState<ClubEvent[]>(() => {
    const saved = localStorage.getItem('cas_events_v3');
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  const [notifications, setNotifications] = useState<ClubNotification[]>(() => {
    const saved = localStorage.getItem('cas_notifications_v3');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem('cas_conversations_v3');
    return saved ? JSON.parse(saved) : INITIAL_CONVERSATIONS;
  });

  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(() => {
    const saved = localStorage.getItem('cas_messages_v3');
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [mediaItems, setMediaItems] = useState<MediaItem[]>(() => {
    const saved = localStorage.getItem('cas_gallery_v1');
    return saved ? JSON.parse(saved) : INITIAL_GALLERY_ITEMS;
  });

  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>(() => {
    const saved = localStorage.getItem('cas_contacts_v1');
    return saved ? JSON.parse(saved) : EMERGENCY_SITUATION_CONTACTS;
  });

  // UI Navigation & Modals
  const [activeTab, setActiveTab] = useState<'members' | 'chat' | 'events' | 'chanda' | 'gallery'>('members');
  const [activeConversationId, setActiveConversationId] = useState<string>('conv-main');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [viewingIdCardMember, setViewingIdCardMember] = useState<Member | null>(null);
  const [deletingMember, setDeletingMember] = useState<Member | null>(null);
  const [isHelplineModalOpen, setIsHelplineModalOpen] = useState(false);

  // Toast alert
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem('cas_members_v3', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem('cas_events_v3', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('cas_notifications_v3', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('cas_conversations_v3', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem('cas_messages_v3', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('cas_gallery_v1', JSON.stringify(mediaItems));
  }, [mediaItems]);

  useEffect(() => {
    localStorage.setItem('cas_contacts_v1', JSON.stringify(emergencyContacts));
  }, [emergencyContacts]);

  // Audio chime effect
  const playChime = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch {
      // Audio fallback
    }
  };

  // Member Handlers
  const handleSaveMember = (memberData: Member) => {
    if (editingMember) {
      setMembers((prev) => prev.map((m) => (m.id === memberData.id ? memberData : m)));
      showToast(`সদস্য "${memberData.name}"-এর তথ্য সফলভাবে আপডেট হয়েছে!`, 'success');
      setEditingMember(null);
    } else {
      setMembers((prev) => [memberData, ...prev]);
      showToast(`নতুন সদস্য "${memberData.name}" ক্লাবে সফলভাবে নিবন্ধিত হয়েছেন!`, 'success');

      const notif: ClubNotification = {
        id: `NOTIF-${Date.now()}`,
        title: `👤 নতুন সদস্য নিবন্ধন: ${memberData.name}`,
        message: `${memberData.name} (${memberData.role.split('(')[0].trim()}) আনন্দ সংঘে যোগদান করেছেন। রক্তের গ্রুপ: ${memberData.bloodGroup}`,
        timestamp: 'এখনই',
        type: 'meeting',
        read: false,
        sender: 'সদস্য সেল',
      };
      setNotifications((prev) => [notif, ...prev]);
      playChime();
    }
  };

  const handleConfirmDelete = (id: string) => {
    const memberToDelete = members.find((m) => m.id === id);
    setMembers((prev) => prev.filter((m) => m.id !== id));
    showToast(`সদস্য "${memberToDelete?.name || ''}"-কে তালিকা থেকে মুছে ফেলা হয়েছে`, 'info');
  };

  // WhatsApp Message Handlers
  const handleSendMessage = (conversationId: string, text: string, options?: Partial<ChatMessage>) => {
    const timeStr = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId: options?.isMe === false ? (options.senderName || 'CAS-MEMBER') : 'me',
      senderName: options?.isMe === false ? (options.senderName || 'ক্লাব সদস্য') : 'আমি (ইউজার)',
      senderRole: options?.senderRole || 'সদস্য',
      senderAvatar:
        options?.senderAvatar ||
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      isMe: options?.isMe !== false,
      text,
      timestamp: timeStr,
      status: 'read',
      mediaType: options?.mediaType || 'text',
      mediaUrl: options?.mediaUrl,
      voiceDuration: options?.voiceDuration,
      replyTo: options?.replyTo,
      reactions: [],
    };

    setMessages((prev) => {
      const convList = prev[conversationId] || [];
      return {
        ...prev,
        [conversationId]: [...convList, newMsg],
      };
    });

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === conversationId) {
          return {
            ...c,
            lastMessage: `${newMsg.isMe ? 'আপনি: ' : ''}${text}`,
            lastTime: timeStr,
          };
        }
        return c;
      })
    );

    playChime();
  };

  // Open Direct Chat with member from Directory
  const handleOpenChatWithMember = (member: Member) => {
    const existingConv = conversations.find(
      (c) => c.type === 'direct' && c.name.includes(member.name)
    );

    if (existingConv) {
      setActiveConversationId(existingConv.id);
      setActiveTab('chat');
    } else {
      const newConvId = `conv-member-${member.id}`;
      const newConv: Conversation = {
        id: newConvId,
        name: `${member.name} (${member.role.split('(')[0].trim()})`,
        type: 'direct',
        avatar: member.avatar,
        lastMessage: 'চ্যাট শুরু করুন...',
        lastTime: 'এখন',
        unreadCount: 0,
        isOnline: true,
      };

      setConversations((prev) => [newConv, ...prev]);
      setActiveConversationId(newConvId);
      setActiveTab('chat');
    }
  };

  // Event RSVP Handler
  const handleRsvp = (eventId: string, status: 'going' | 'maybe' | 'declined') => {
    setEvents((prev) =>
      prev.map((evt) => {
        if (evt.id === eventId) {
          const oldStatus = evt.userRsvp;
          const newCounts = { ...evt.rsvpCount };

          if (oldStatus === 'going') newCounts.going = Math.max(0, newCounts.going - 1);
          if (oldStatus === 'maybe') newCounts.maybe = Math.max(0, newCounts.maybe - 1);
          if (oldStatus === 'declined') newCounts.declined = Math.max(0, newCounts.declined - 1);

          if (status === 'going') newCounts.going += 1;
          if (status === 'maybe') newCounts.maybe += 1;
          if (status === 'declined') newCounts.declined += 1;

          return {
            ...evt,
            rsvpCount: newCounts,
            userRsvp: status,
          };
        }
        return evt;
      })
    );

    const labels = {
      going: 'উপস্থিত থাকছেন (Going)',
      maybe: 'হয়তো উপস্থিত থাকবেন (Maybe)',
      declined: 'উপস্থিত থাকতে পারছেন না',
    };
    showToast(`আপনার উপস্থিতি আপডেট করা হয়েছে: ${labels[status]}`, 'info');
  };

  // Event Add & Broadcast
  const handleAddEvent = (newEvent: ClubEvent, alsoNotify: boolean) => {
    setEvents((prev) => [newEvent, ...prev]);
    showToast(`নতুন ইভেন্ট "${newEvent.title}" প্রকাশিত হয়েছে!`, 'success');

    if (alsoNotify) {
      const notif: ClubNotification = {
        id: `NOTIF-${Date.now()}`,
        title: `📢 নতুন ক্লাব ইভেন্ট: ${newEvent.title}`,
        message: `তারিখ: ${newEvent.date} · স্থান: ${newEvent.location}। সকল সদস্যদের আমন্ত্রণ জানানো হচ্ছে।`,
        timestamp: 'এখনই',
        type: 'event',
        read: false,
        sender: newEvent.organizer,
        eventId: newEvent.id,
      };
      setNotifications((prev) => [notif, ...prev]);

      handleSendMessage('conv-notices', `📢 নতুন ইভেন্ট ঘোষিত হয়েছে: ${newEvent.title} (${newEvent.date})। বিস্তারিত জানতে ইভেন্ট ট্যাবে চোখ রাখুন।`, {
        isMe: false,
        senderName: 'অফিসিয়াল নোটিশ বোর্ড',
        senderRole: 'অ্যাডমিন',
        mediaType: 'notice',
      });

      playChime();
    }
  };

  // Broadcast Notification
  const handleBroadcastNotification = (
    title: string,
    message: string,
    type: 'event' | 'emergency' | 'meeting'
  ) => {
    const notif: ClubNotification = {
      id: `NOTIF-${Date.now()}`,
      title,
      message,
      timestamp: 'এখনই',
      type,
      read: false,
      sender: 'সাধারণ সম্পাদক (অনির্বাণ চক্রবর্তী)',
    };
    setNotifications((prev) => [notif, ...prev]);
    showToast('সকল সদস্যদের অ্যাপে জরুরি নোটিফিকেশন অ্যালার্ট পাঠানো হয়েছে!', 'success');
    playChime();
  };

  // Chanda Toggle
  const handleToggleChandaStatus = (memberId: string) => {
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id === memberId) {
          const next = m.subscriptionStatus === 'paid' ? 'due' : 'paid';
          return { ...m, subscriptionStatus: next };
        }
        return m;
      })
    );
    showToast('সদস্যের চাঁদা স্ট্যাটাস সফলভাবে আপডেট হয়েছে', 'info');
  };

  // Gallery Handlers
  const handleAddMedia = (item: MediaItem) => {
    setMediaItems((prev) => [item, ...prev]);
    showToast(
      item.type === 'video'
        ? `ভিডিও "${item.title}" সফলভাবে গ্যালারিতে সেভ হয়েছে!`
        : `ছবি "${item.title}" সফলভাবে গ্যালারিতে সেভ হয়েছে!`,
      'success'
    );
    playChime();
  };

  const handleDeleteMedia = (id: string) => {
    setMediaItems((prev) => prev.filter((m) => m.id !== id));
    showToast('মিডিয়া ফাইলটি গ্যালারি থেকে মুছে ফেলা হয়েছে', 'info');
  };

  const handleToggleMediaLike = (id: string) => {
    setMediaItems((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const isLiked = !m.isUserLiked;
          return {
            ...m,
            isUserLiked: isLiked,
            likes: isLiked ? m.likes + 1 : Math.max(0, m.likes - 1),
          };
        }
        return m;
      })
    );
  };

  // Share emergency contact to active chat
  const handleShareContactToChat = (contactText: string) => {
    handleSendMessage(activeConversationId, contactText, {
      mediaType: 'notice',
    });
    setActiveTab('chat');
    showToast('জরুরি হেল্পলাইন নম্বর চ্যাটে শেয়ার করা হয়েছে!', 'success');
  };

  const totalUnreadChats = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans relative">
      {/* Toast banner */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl bg-slate-900 text-white text-xs font-semibold border border-slate-700 animate-in fade-in slide-in-from-top-4 duration-200">
          {toast.type === 'success' ? (
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Check className="w-3.5 h-3.5" />
            </div>
          ) : toast.type === 'error' ? (
            <div className="w-6 h-6 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center">
              <AlertCircle className="w-3.5 h-3.5" />
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Info className="w-3.5 h-3.5" />
            </div>
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Floating Emergency Helpline Button */}
      <button
        onClick={() => setIsHelplineModalOpen(true)}
        className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-40 px-3.5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xl flex items-center gap-2 border-2 border-white dark:border-slate-800 transition-all active:scale-95 group hover:shadow-red-900/30"
        title="জরুরি সিচুয়েশন ফোন নাম্বারসমূহ"
      >
        <PhoneCall className="w-4 h-4 animate-bounce" />
        <span className="hidden sm:inline">জরুরি সিচুয়েশন ফোন</span>
        <span className="w-2 h-2 rounded-full bg-white animate-ping" />
      </button>

      {/* Primary Top Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onAddMemberClick={() => {
          setEditingMember(null);
          setIsAddModalOpen(true);
        }}
        notifications={notifications}
        onMarkNotificationAsRead={(id) => {
          setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
          );
        }}
        onMarkAllNotificationsAsRead={() => {
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
          showToast('সকল নোটিফিকেশন পড়া হয়েছে চিহ্নিত করা হলো', 'info');
        }}
        onSelectEvent={(eventId) => {
          setActiveTab('events');
        }}
        unreadChatCount={totalUnreadChats}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {activeTab === 'members' && (
          <MembersView
            members={members}
            onAddMemberClick={() => {
              setEditingMember(null);
              setIsAddModalOpen(true);
            }}
            onEditMember={(m) => {
              setEditingMember(m);
              setIsAddModalOpen(true);
            }}
            onDeleteMember={(id) => {
              const target = members.find((m) => m.id === id);
              if (target) {
                setDeletingMember(target);
              }
            }}
            onViewIdCard={(m) => setViewingIdCardMember(m)}
            onOpenChatWithMember={handleOpenChatWithMember}
          />
        )}

        {activeTab === 'chat' && (
          <WhatsAppChatView
            conversations={conversations}
            messages={messages}
            activeConversationId={activeConversationId}
            onSelectConversation={(id) => {
              setActiveConversationId(id);
              setConversations((prev) =>
                prev.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c))
              );
            }}
            onSendMessage={handleSendMessage}
            members={members}
            onOpenHelpline={() => setIsHelplineModalOpen(true)}
          />
        )}

        {activeTab === 'gallery' && (
          <GalleryView
            mediaItems={mediaItems}
            onAddMedia={handleAddMedia}
            onDeleteMedia={handleDeleteMedia}
            onToggleLike={handleToggleMediaLike}
          />
        )}

        {activeTab === 'events' && (
          <EventsView
            events={events}
            onRsvp={handleRsvp}
            onAddEvent={handleAddEvent}
            onBroadcastNotification={handleBroadcastNotification}
          />
        )}

        {activeTab === 'chanda' && (
          <ChandaView members={members} onToggleStatus={handleToggleChandaStatus} />
        )}
      </main>

      {/* Modals */}
      <AddMemberModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingMember(null);
        }}
        onAddMember={handleSaveMember}
        initialData={editingMember}
      />

      <MemberIdCardModal
        member={viewingIdCardMember}
        onClose={() => setViewingIdCardMember(null)}
      />

      <DeleteConfirmModal
        member={deletingMember}
        isOpen={!!deletingMember}
        onClose={() => setDeletingMember(null)}
        onConfirmDelete={handleConfirmDelete}
      />

      <EmergencyHelplineModal
        isOpen={isHelplineModalOpen}
        onClose={() => setIsHelplineModalOpen(false)}
        contacts={emergencyContacts}
        onAddContact={(newC) => {
          setEmergencyContacts((prev) => [newC, ...prev]);
          showToast(`নতুন হেল্পলাইন "${newC.title}" সেভ হয়েছে!`, 'success');
        }}
        onShareToChat={handleShareContactToChat}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={CLUB_INFO.logo}
              alt="Club Logo"
              className="w-8 h-8 rounded-full border border-amber-400/60"
            />
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-200">
                {CLUB_INFO.nameBn} ({CLUB_INFO.nameEn})
              </p>
              <p className="text-[11px] text-slate-400">
                স্থাপিত: {CLUB_INFO.established} · রেজি: {CLUB_INFO.registrationNo}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              {CLUB_INFO.address}
            </span>
            <span className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-emerald-600" />
              <a href={`mailto:${CLUB_INFO.email}`} className="hover:underline">
                {CLUB_INFO.email}
              </a>
            </span>
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              {CLUB_INFO.phone}
            </span>
          </div>

          <div className="text-[11px] text-slate-400">
            © ২০২৬ {CLUB_INFO.nameBn} · সর্বস্বত্ব সংরক্ষিত
          </div>
        </div>
      </footer>
    </div>
  );
}
