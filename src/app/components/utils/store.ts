import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isVendor: boolean;
  verified: boolean;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'order' | 'message' | 'system';
}

interface AppState {
  user: User | null;
  notifications: Notification[];
  isSupportOpen: boolean;
  setSupportOpen: (open: boolean) => void;
  markNotificationRead: (id: string) => void;
  login: (user: User) => void;
  logout: () => void;
}

export const useStore = create<AppState>((set) => ({
  user: {
    id: '1',
    name: 'Adebayo M.',
    email: 'adebayo.m@oduduwa.edu.ng',
    isVendor: false,
    verified: true,
    avatar: 'https://i.pravatar.cc/150?u=adebayo'
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
  isSupportOpen: false,
  setSupportOpen: (open) => set({ isSupportOpen: open }),
  markNotificationRead: (id) => set((state) => ({
    notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
  })),
  login: (user) => set({ user }),
  logout: () => set({ user: null })
}));
