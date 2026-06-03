import { create } from 'zustand';

interface Review {
  id: string;
  productId: number;
  userName: string;
  rating: number;
  comment: string;
  time: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'order' | 'message' | 'system' | 'sale' | 'payout';
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isVendor: boolean;
  verified: boolean;
  walletBalance: number;
  referralCode: string;
  referralsCount: number;
  referralEarnings: number;
  isAdmin?: boolean;
}

interface Message {
  id: string;
  text: string;
  sender: "user" | "support";
  timestamp: Date;
  userId: string;
}

interface AppState {
  user: User | null;
  notifications: Notification[];
  reviews: Review[];
  isSupportOpen: boolean;
  supportMessages: Message[];
  setSupportOpen: (open: boolean) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addNotification: (n: Omit<Notification, 'id' | 'read'>) => void;
  addReview: (r: Omit<Review, 'id' | 'time'>) => void;
  login: (user: User) => void;
  logout: () => void;
  updateBalance: (amount: number) => void;
  addSupportMessage: (m: Omit<Message, 'id' | 'timestamp'>) => void;
  setVendorStatus: (status: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
  user: {
    id: '1',
    name: 'Adebayo M.',
    email: 'adebayo.m@oduduwa.edu.ng',
    isVendor: false,
    verified: true,
    avatar: 'https://i.pravatar.cc/150?u=adebayo',
    walletBalance: 12500,
    referralCode: 'OUI-ADE-2026',
    referralsCount: 8,
    referralEarnings: 4000,
    isAdmin: true
  },
  notifications: [
    {
      id: '1',
      title: 'Order Confirmed',
      message: 'Your order for Jollof Rice has been confirmed by Mama Kitchen.',
      time: '2 mins ago',
      read: false,
      type: 'order'
    },
    {
      id: '2',
      title: 'New Message',
      message: 'OUI Tech Hub replied to your inquiry.',
      time: '1 hour ago',
      read: false,
      type: 'message'
    },
    {
      id: '3',
      title: 'Security Alert',
      message: 'Your account was accessed from a new device.',
      time: 'Yesterday',
      read: true,
      type: 'system'
    }
  ],
  reviews: [
    {
      id: '1',
      productId: 1,
      userName: 'Sarah K.',
      rating: 5,
      comment: 'Best Jollof on campus! The chicken was so tender.',
      time: '2 days ago'
    },
    {
      id: '2',
      productId: 2,
      userName: 'James L.',
      rating: 4,
      comment: 'Authentic AirPods. Delivery was a bit slow though.',
      time: '1 week ago'
    }
  ],
  supportMessages: [
    {
      id: "1",
      text: "Hello! Welcome to OUI Market Support. How can we help you today?",
      sender: "support",
      timestamp: new Date(),
      userId: "1"
    }
  ],
  isSupportOpen: false,
  setSupportOpen: (open) => set({ isSupportOpen: open }),
  markNotificationRead: (id) => set((state) => ({
    notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
  })),
  markAllNotificationsRead: () => set((state) => ({
    notifications: state.notifications.map(n => ({ ...n, read: true }))
  })),
  addNotification: (n) => set((state) => ({
    notifications: [
      {
        ...n,
        id: Date.now().toString(),
        read: false
      },
      ...state.notifications
    ]
  })),
  addReview: (r) => set((state) => ({
    reviews: [
      {
        ...r,
        id: Date.now().toString(),
        time: 'Just now'
      },
      ...state.reviews
    ]
  })),
  login: (user) => set({ user }),
  logout: () => set({ user: null }),
  updateBalance: (amount) => set((state) => ({
    user: state.user ? { ...state.user, walletBalance: state.user.walletBalance + amount } : null
  })),
  addSupportMessage: (m) => set((state) => ({
    supportMessages: [
      ...state.supportMessages,
      {
        ...m,
        id: Date.now().toString(),
        timestamp: new Date()
      }
    ]
  })),
  setVendorStatus: (status) => set((state) => ({
    user: state.user ? { ...state.user, isVendor: status } : null
  }))
}));
