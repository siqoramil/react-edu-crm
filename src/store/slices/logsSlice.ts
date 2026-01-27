import type { StateCreator } from 'zustand'
import type { AuditLog } from '@/types'
import type { StoreState } from '../index'
import { seedAuditLogs } from '@/data/data'

export interface LogsSlice {
  auditLogs: AuditLog[]
  addLog: (log: Omit<AuditLog, 'id' | 'userId' | 'userName' | 'timestamp'>) => void
}

export const createLogsSlice: StateCreator<StoreState, [], [], LogsSlice> = (set, get) => ({
  auditLogs: [...seedAuditLogs],

  addLog: (log) =>
    set((state) => {
      const user = get().user
      const entry: AuditLog = {
        id: `al-${Date.now()}`,
        userId: user?.id ?? 'system',
        userName: user?.name ?? 'System',
        ...log,
        timestamp: new Date().toISOString(),
      }
      return { auditLogs: [entry, ...state.auditLogs] }
    }),
})
