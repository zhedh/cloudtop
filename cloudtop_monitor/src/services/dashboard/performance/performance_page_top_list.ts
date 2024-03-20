import { ApiResponse, StatParams } from '../../../types'
import { httpCatch } from '../../../utils/http'

export interface PerformancePageTopRecord {
  page: string
  count: number
  // ready: number
  // load: number
  // lcp: number
  load: {
    count: number
    min: number
    max: number
    avg: number
    sum: number
  }
}

export const performancePageTopList = (
  params: StatParams
): ApiResponse<PerformancePageTopRecord[]> =>
  httpCatch.get('/dashboard/performance/page/top/list', { params })
