import { ApiResponse, StatParams } from '../../../types'
import { OverviewFlowType } from '../../../types/dashboard'
import { httpCatch } from '../../../utils/http'

export interface OverviewFlowRecord {
  type: OverviewFlowType
  value: number
  ratio: number
}

export const overviewFlow = (
  params: StatParams
): ApiResponse<OverviewFlowRecord[]> =>
  httpCatch.get('/dashboard/overview/flow', { params })
