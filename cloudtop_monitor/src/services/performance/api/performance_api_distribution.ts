import { ApiResponse, ChartRecord, StatParams } from '../../../types'
import { httpCatch } from '../../../utils/http'

export const performanceApiDistribution = (
  params: { interval?: number } & StatParams
): ApiResponse<ChartRecord[]> =>
  httpCatch.get('/performance/api/distribution', { params })
