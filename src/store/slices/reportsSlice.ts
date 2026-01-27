import type { StateCreator } from 'zustand'
import type {
  RevenueDataPoint, UserGrowthDataPoint,
  ProductPerformanceData, TicketSLAData,
} from '@/types'
import type { StoreState } from '../index'
import {
  seedRevenueData, seedUserGrowthData,
  seedProductPerformance, seedTicketSLAData,
} from '@/data/data'

export interface ReportsSlice {
  revenueData: RevenueDataPoint[]
  userGrowthData: UserGrowthDataPoint[]
  productPerformance: ProductPerformanceData[]
  ticketSLAData: TicketSLAData[]
}

export const createReportsSlice: StateCreator<StoreState, [], [], ReportsSlice> = () => ({
  revenueData: [...seedRevenueData],
  userGrowthData: [...seedUserGrowthData],
  productPerformance: [...seedProductPerformance],
  ticketSLAData: [...seedTicketSLAData],
})
