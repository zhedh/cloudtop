import { ApiResponse, StatParams } from '../../../types'
import { httpCatch } from '../../../utils/http'

export interface PerformancePageTerritoryRecord {
  key: string
  count: number
  load: number
}

export const performancePageTerritory = (
  params: StatParams
): ApiResponse<PerformancePageTerritoryRecord[]> =>
  httpCatch.get('/performance/page/territory', { params })
