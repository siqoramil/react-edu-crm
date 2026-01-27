import type { StateCreator } from 'zustand'
import type { Theme } from '@/types'
import type { StoreState } from '../index'

export interface UISlice {
  theme: Theme
  sidebarCollapsed: boolean
  globalSearch: string
  toggleTheme: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
  setGlobalSearch: (query: string) => void
}

export const createUISlice: StateCreator<StoreState, [], [], UISlice> = (set) => ({
  theme: (localStorage.getItem('theme') as Theme) || 'light',
  sidebarCollapsed: localStorage.getItem('sidebarCollapsed') === 'true',
  globalSearch: '',

  toggleTheme: () =>
    set((state) => {
      const next = state.theme === 'light' ? 'dark' : 'light'
      localStorage.setItem('theme', next)
      document.documentElement.classList.toggle('dark', next === 'dark')
      return { theme: next }
    }),

  setSidebarCollapsed: (collapsed: boolean) => {
    localStorage.setItem('sidebarCollapsed', String(collapsed))
    set({ sidebarCollapsed: collapsed })
  },

  setGlobalSearch: (query: string) => set({ globalSearch: query }),
})
