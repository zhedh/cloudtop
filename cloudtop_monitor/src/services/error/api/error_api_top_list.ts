import { ApiResponse, StatParams } from '../../../types'
import { httpCatch } from '../../../utils/http'

export interface ErrorApiTopListParams extends StatParams {
  sort?: string
  order?: 'desc' | 'asc'
}

export interface ApiErrorTopRecordItem {
  id: string
  api: string
  status: number
  date: number
  url: string
  uid: string
}

export interface ApiErrorTopRecord {
  id: string
  api: string
  status: number
  date: number
  count: number
  userCount: number
  timeRange: number[]
  records: ApiErrorTopRecordItem[]
}

export const apiErrorTopList = (
  params: ErrorApiTopListParams
): ApiResponse<ApiErrorTopRecord[]> =>
  httpCatch.get('/error/api/top/list', { params })
