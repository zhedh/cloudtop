import { ApiResponse, ChartRecord, StatParams } from '../../../types'
import { httpCatch } from '../../../utils/http'

export const territoryUserStat = (
  params: StatParams
): ApiResponse<ChartRecord[]> =>
  httpCatch.get('/dashboard/territory/user/stat', { params })
