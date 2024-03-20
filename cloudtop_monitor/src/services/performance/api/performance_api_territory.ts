import { ApiResponse, StatParams } from '../../../types'
import { httpCatch } from '../../../utils/http'

export interface PerformanceApiTerritoryRecord {
  key: string
  count: number
  success: number
  successRatio: number
}

export const performanceApiTerritory = (
  params: StatParams
): ApiResponse<PerformanceApiTerritoryRecord[]> =>
  httpCatch.get('/performance/api/territory', { params })
