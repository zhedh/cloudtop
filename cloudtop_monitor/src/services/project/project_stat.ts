import { ApiResponse } from '../../types'
import { httpCatch } from '../../utils/http'

export interface QueryProjectStatParams {
  projectCode: string
  startTime: string // YYYY-MM-DD HH:mm:ss
  endTime: string // YYYY-MM-DD HH:mm:ss
}

export interface ProjectStatData {
  pv: number
  uv: number
  error: number
  resourceError: number
  errorRatio: number
  resourceErrorRatio: number
  score: number
}

/**
 * 获取项目今日统计数据
 * @param data
 * @returns
 */
export const queryProjectStat = (
  params: QueryProjectStatParams
): ApiResponse<ProjectStatData> => httpCatch.get('/project/stat', { params })
