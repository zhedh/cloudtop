import { ApiResponse, StatParams } from '../../../types'
import { httpCatch } from '../../../utils/http'

export interface JsErrorTopRecord {
  category: string
  msg: string
  date: number | string
  reportTime: number | string
  count: number
  userCount: number
}

export const jsErrorTopList = (
  params: StatParams
): ApiResponse<JsErrorTopRecord[]> =>
  httpCatch.get('/error/js/toplist', { params })
