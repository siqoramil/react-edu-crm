import { create } from 'zustand'
import { type AuthSlice, createAuthSlice } from './slices/authSlice'
import { type UISlice, createUISlice } from './slices/uiSlice'
import { type EntitiesSlice, createEntitiesSlice } from './slices/entitiesSlice'
import { type LogsSlice, createLogsSlice } from './slices/logsSlice'
import { type NotificationsSlice, createNotificationsSlice } from './slices/notificationsSlice'
import { type ReportsSlice, createReportsSlice } from './slices/reportsSlice'

export type StoreState = AuthSlice &
  UISlice &
  EntitiesSlice &
  LogsSlice &
  NotificationsSlice &
  ReportsSlice

export const useStore = create<StoreState>()((...a) => ({
  ...createAuthSlice(...a),
  ...createUISlice(...a),
  ...createEntitiesSlice(...a),
  ...createLogsSlice(...a),
  ...createNotificationsSlice(...a),
  ...createReportsSlice(...a),
}))
