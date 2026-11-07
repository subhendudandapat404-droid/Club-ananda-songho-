export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type MemberRole =
  | 'চেয়ারম্যান (Chairman)'
  | 'সভাপতি (President)'
  | 'সহ-সভাপতি (Vice President)'
  | 'ম্যানেজমেন্ট ও পরিচালনা (Management & Steering)'
  | 'প্রধান উদ্যোক্তা (Chief Initiator / Organizer)'
  | 'কমেডি ও বিনোদন কমিটি (Comedy & Entertainment)'
  | 'সাধারণ সম্পাদক (General Secretary)'
  | 'যুগ্ম সম্পাদক (Joint Secretary)'
  | 'কোষাধ্যক্ষ (Treasurer)'
  | 'ক্রীড়া সম্পাদক (Sports Secretary)'
  | 'সাংস্কৃতিক সম্পাদক (Cultural Secretary)'
  | 'কার্যনির্বাহী সদস্য (Executive Member)'
  | 'সাধারণ সদস্য (General Member)'
  | 'আজীবন সদস্য (Life Member)'
  | string;

export interface Member {
  id: string; // e.g. CAS-2024-001
  name: string;
  nameEn: string;
  role: MemberRole;
  phone: string;
  email: string;
  bloodGroup: BloodGroup;
  address: string;
  joinDate: string;
  subscriptionStatus: 'paid' | 'due';
  monthlyFee: number;
  avatar: string;
  emergencyContact: string;
  isVolunteer: boolean;
  notes?: string;
}

export type EventCategory = 'sports' | 'cultural' | 'social' | 'meeting';

export interface ClubEvent {
  id: string;
  title: string;
  category: EventCategory;
  date: string;
  time: string;
  location: string;
  image: string;
  description: string;
  organizer: string;
  rsvpCount: {
    going: number;
    maybe: number;
    declined: number;
  };
  userRsvp?: 'going' | 'maybe' | 'declined' | null;
  isUrgentNotice?: boolean;
}

export interface ClubNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'event' | 'chanda' | 'meeting' | 'emergency';
  read: boolean;
  sender: string;
  eventId?: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole?: string;
  senderAvatar?: string;
  isMe: boolean;
  text: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  mediaType?: 'text' | 'image' | 'voice' | 'notice';
  mediaUrl?: string;
  voiceDuration?: string;
  replyTo?: {
    id: string;
    senderName: string;
    text: string;
  };
  reactions?: {
    emoji: string;
    count: number;
    hasReacted?: boolean;
  }[];
}

export interface Conversation {
  id: string;
  name: string;
  type: 'group' | 'channel' | 'direct';
  avatar: string;
  description?: string;
  lastMessage: string;
  lastTime: string;
  unreadCount: number;
  isOnline?: boolean;
  membersCount?: number;
}

export type MediaType = 'image' | 'video';
export type MediaCategory = 'kali_puja' | 'sports' | 'social' | 'cultural' | 'reunion';

export interface MediaItem {
  id: string;
  title: string;
  type: MediaType;
  category: MediaCategory;
  url: string;
  thumbnail?: string;
  videoUrl?: string;
  duration?: string;
  date: string;
  uploadedBy: string;
  description?: string;
  likes: number;
  isUserLiked?: boolean;
}

export interface EmergencyContact {
  id: string;
  title: string;
  situation: string;
  contactPerson: string;
  phone: string;
  availableTime: string;
  iconType: 'ambulance' | 'police' | 'blood' | 'club' | 'sports' | 'fire' | 'chanda' | 'puja';
}
