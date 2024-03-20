import { ApiResponse, StatParams } from '../../../types'
import { PerformanceType } from '../../../types/performance'
import { httpCatch } from '../../../utils/http'

export interface PerformancePageStatRecord {
  type: PerformanceType
  value: number
  ratio: number
}

export const performancePageStat = (
  params: StatParams
): ApiResponse<PerformancePageStatRecord[]> =>
  httpCatch.get('/performance/page/stat', { params })
