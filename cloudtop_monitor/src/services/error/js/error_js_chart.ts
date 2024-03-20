import { ApiResponse, StatParams } from '../../../types'
import { httpCatch } from '../../../utils/http'

export interface JsErrorChartRecord {
  key: string
  value: number
}

export const jsErrorChart = (
  params: StatParams
): ApiResponse<JsErrorChartRecord[]> =>
  httpCatch.get('/error/js/chart', { params })
