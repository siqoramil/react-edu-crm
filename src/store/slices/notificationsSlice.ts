import type { StateCreator } from 'zustand'
import type { Notification } from '@/types'
import type { StoreState } from '../index'
import { seedNotifications } from '@/data/data'

export interface NotificationsSlice {
  notifications: Notification[]
  addNotification: (n: Omit<Notification, 'id' | 'read' | 'timestamp'>) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  clearNotifications: () => void
}

export const createNotificationsSlice: StateCreator<StoreState, [], [], NotificationsSlice> = (set) => ({
  notifications: [...seedNotifications],

  addNotification: (n) =>
    set((state) => ({
      notifications: [
        {
          id: `n-${Date.now()}`,
          ...n,
          read: false,
          timestamp: new Date().toISOString(),
        },
        ...state.notifications,
      ],
    })),

  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    })),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    })),

  clearNotifications: () => set({ notifications: [] }),
})
