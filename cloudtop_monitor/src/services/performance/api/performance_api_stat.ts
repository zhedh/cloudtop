import { ApiResponse, StatParams } from '../../../types'
import { PerformanceApiType } from '../../../types/performance'
import { httpCatch } from '../../../utils/http'

export interface PerformanceApiStatRecord {
  type: PerformanceApiType
  value: number
  ratio: number
}

export const performanceApiStat = (
  params: StatParams
): ApiResponse<PerformanceApiStatRecord[]> =>
  httpCatch.get('/performance/api/stat', { params })
