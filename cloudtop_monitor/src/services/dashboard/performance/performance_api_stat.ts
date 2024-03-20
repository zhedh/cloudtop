import { ApiResponse, StatParams } from '../../../types'
import { httpCatch } from '../../../utils/http'

export interface PerformanceApiStatData {
  count: number
  time: number
  success: number
  successRatio: number
}

export const performanceApiStat = (
  params: StatParams
): ApiResponse<PerformanceApiStatData> =>
  httpCatch.get('/dashboard/performance/api/stat', { params })
