import { ApiResponse, StatParams } from '../../../types'
import { httpCatch } from '../../../utils/http'

export interface ResourceErrorTopRecord {
  id: string
  src: string
  // msg: string
  date: number | string
  reportTime: number | string
  count: number
  pvCount: number
  userCount: number
}

export const resourceErrorTopList = (
  params: StatParams
): ApiResponse<ResourceErrorTopRecord[]> =>
  httpCatch.get('/error/resource/toplist', { params })
