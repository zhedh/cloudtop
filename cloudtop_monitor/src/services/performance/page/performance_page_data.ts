import { ApiResponse, StatParams } from '../../../types'
import { httpCatch } from '../../../utils/http'

export interface PerformancePageDataParams extends StatParams {
  timeInterval: number
}

export interface PerformancePageDataRecord {
  key: string
  count: number
  ttfb: number
  ready: number
  load: number
  lcp: number

  dns: number
  tcp: number
  ssl: number
  // ttfb: number
  trans: number
  dom: number
  res: number
}

export const performancePageData = (
  params: PerformancePageDataParams
): ApiResponse<PerformancePageDataRecord[]> =>
  httpCatch.get('/performance/page/data', { params })
