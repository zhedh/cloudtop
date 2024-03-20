import { ApiResponse, StatParams } from '../../../types'
import { httpCatch } from '../../../utils/http'

export interface PerformanceApiListParams extends StatParams {
  api?: string
}

export interface PerformanceApiListRecord {
  api: string
  count: number
  time: number
  successCount: number
  successRatio: number
  slowCount: number
  slowRatio: number
  errorCount: number
  errorUserCount: number
  origin: string
}

export const performanceApiList = (
  params: PerformanceApiListParams
): ApiResponse<PerformanceApiListRecord[]> =>
  httpCatch.get('/performance/api/list', { params })
