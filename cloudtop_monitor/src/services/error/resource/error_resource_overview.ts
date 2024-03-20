import { ApiResponse, ChartRecord, StatDateParams } from '../../../types'
import { httpCatch } from '../../../utils/http'

export const resourceErrorOverview = (
  params: StatDateParams
): ApiResponse<ChartRecord[]> =>
  httpCatch.get('/error/resource/overview', { params })
