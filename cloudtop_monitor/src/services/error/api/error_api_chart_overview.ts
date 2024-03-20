import { ApiResponse, StatDateParams } from '../../../types'
import { httpCatch } from '../../../utils/http'

export interface ApiErrorOverviewRecord {
  key: string
  total: number
  error: number
  errorRadio: number
}

export const apiErrorChartOverview = (
  params: StatDateParams
): ApiResponse<ApiErrorOverviewRecord[]> =>
  httpCatch.get('/error/api/chart/overview', { params })
