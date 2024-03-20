import { ApiResponse, StatParams } from '../../../types'
import { httpCatch } from '../../../utils/http'

export interface ResourceErrorStatData {
  count: number
  uv: number
  pv: number
}

export const resourceErrorStat = (
  params: StatParams
): ApiResponse<ResourceErrorStatData> =>
  httpCatch.get('/error/resource/stat', { params })
