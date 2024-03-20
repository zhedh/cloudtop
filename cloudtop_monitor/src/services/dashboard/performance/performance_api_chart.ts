import { ApiResponse, ChartRecord, StatParams } from '../../../types'
import { httpCatch } from '../../../utils/http'

export const performanceApiChart = (
  params: StatParams
): ApiResponse<ChartRecord[]> =>
  httpCatch.get('/dashboard/performance/api/chart', { params })
