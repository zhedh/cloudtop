import { ApiResponse, ChartRecord, StatParams } from '../../../types'
import { httpCatch } from '../../../utils/http'

export const performancePageWaterfall = (
  params: { page?: string } & StatParams
): ApiResponse<ChartRecord[]> =>
  httpCatch.get('/performance/page/waterfall', { params })
