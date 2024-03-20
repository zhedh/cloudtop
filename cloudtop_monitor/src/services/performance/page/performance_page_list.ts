import { ApiResponse, StatParams } from '../../../types'
import { httpCatch } from '../../../utils/http'

export interface PerformancePageListParams extends StatParams {
  page?: string
}

export interface PerformancePageListRecord {
  page: string
  count: number
  ttfb: number
  ttfbPrev: number
  ttfbRate: number
  ready: number
  readyPrev: number
  readyRate: number
  load: number
  loadPrev: number
  loadRate: number
  lcp: number
  lcpPrev: number
  lcpRate: number
}

export const performancePageList = (
  params: PerformancePageListParams
): ApiResponse<PerformancePageListRecord[]> =>
  httpCatch.get('/performance/page/list', { params })
