import { ApiResponse, StatParams } from '../../../types'
import { HealthRecordType } from '../../../types/dashboard'
import { httpCatch } from '../../../utils/http'

export interface HealthScoreRecord {
  type: HealthRecordType
  count: number
  ratio: number
}

export interface HealthScoreData {
  score: number
  records: HealthScoreRecord[]
}

export const healthScore = (params: StatParams): ApiResponse<HealthScoreData> =>
  httpCatch.get('/dashboard/health/score', { params })
