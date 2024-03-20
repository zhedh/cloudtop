import { ApiResponse, StatParams } from '../../../types'
import { httpCatch } from '../../../utils/http'

export interface OverviewCoreChartRecord {
  key: 'currentDate' | 'dayBeforeDate' | 'weekBeforeDate'
  date: string // YYYY-MM-DD

  data: { key: string; pv: number; uv: number }[]
}

export const overviewCoreChart = (
  params: StatParams
): ApiResponse<OverviewCoreChartRecord[]> =>
  httpCatch.get('/dashboard/overview/chart/core', { params })
