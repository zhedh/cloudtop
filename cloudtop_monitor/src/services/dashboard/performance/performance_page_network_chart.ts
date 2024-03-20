import { ApiResponse, ChartRecord, StatParams } from '../../../types'
import { httpCatch } from '../../../utils/http'

export const performancePageNetworkChart = (
  params: StatParams
): ApiResponse<ChartRecord[]> =>
  httpCatch.get('/dashboard/performance/page/network/chart', { params })
