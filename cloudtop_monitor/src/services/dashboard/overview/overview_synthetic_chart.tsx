import { ApiResponse, ChartRecord, StatParams } from '../../../types'
import { httpCatch } from '../../../utils/http'

export interface OverviewSyntheticChartRecord {
  type: string
  records: ChartRecord[]
}

export const overviewSyntheticChart = (
  params: StatParams
): ApiResponse<OverviewSyntheticChartRecord[]> =>
  httpCatch.get('/dashboard/overview/chart/synthetic', { params })
