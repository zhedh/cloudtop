import { ApiResponse, StatDateParams } from '../../../types'
import { httpCatch } from '../../../utils/http'

export interface JsErrorOverviewRecord {
  key: string
  total: number
  error: number
  errorRadio: number
}

export const jsErrorOverview = (
  params: StatDateParams
): ApiResponse<JsErrorOverviewRecord[]> =>
  httpCatch.get('/error/js/overview', { params })
