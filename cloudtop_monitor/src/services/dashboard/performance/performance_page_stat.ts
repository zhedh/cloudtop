import { ApiResponse, StatParams } from '../../../types'
import { httpCatch } from '../../../utils/http'

export interface PerformancePageStatData {
  ttfb: number
  ready: number
  load: number
  lcp: number
}

export const performancePageStat = (
  params: StatParams
): ApiResponse<PerformancePageStatData> =>
  httpCatch.get('/dashboard/performance/page/stat', { params })
