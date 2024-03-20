import { ApiResponse, StatParams } from '../../../types'
import { httpCatch } from '../../../utils/http'

export interface PerformanceApiTopRecord {
  api: string
  count: number
  time: {
    count: number
    min: number
    max: number
    avg: number
    sum: number
  }
}

export const performanceApiTopList = (
  params: StatParams
): ApiResponse<PerformanceApiTopRecord[]> =>
  httpCatch.get('/dashboard/performance/api/top/list', { params })
