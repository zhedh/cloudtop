import { ApiResponse, StatParams } from '../../../types'
import { httpCatch } from '../../../utils/http'

export interface ApiErrorDateStatRecord {
  key: number
  value: number
}

export const apiErrorDateStat = (
  params: StatParams
): ApiResponse<ApiErrorDateStatRecord[]> =>
  httpCatch.get('/error/api/stat/date', { params })
