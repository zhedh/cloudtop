import { ApiResponse, StatParams } from '../../../types'
import { httpCatch } from '../../../utils/http'

export interface PerformanceApiDataParams extends StatParams {
  timeInterval: number
}

export interface PerformanceApiDataRecord {
  key: string
  count: number
  // total: number
  time: number
  successCount: number
  successRatio: number
  slowCount: number
  slowRatio: number
}

export const performanceApiData = (
  params: PerformanceApiDataParams
): ApiResponse<PerformanceApiDataRecord[]> =>
  httpCatch.get('/performance/api/data', { params })
