import { ApiResponse, ChartRecord, StatParams } from '../../../types'
import { HealthRecordType } from '../../../types/dashboard'
import { httpCatch } from '../../../utils/http'

export interface HealthChartParams extends StatParams {
  type: HealthRecordType
}

export interface HealthChartRecord {
  key: 'currentDate' | 'dayBeforeDate' | 'weekBeforeDate'
  date: string // YYYY-MM-DD
  data: ChartRecord[]
}

export const healthChart = (
  params: HealthChartParams
): ApiResponse<HealthChartRecord[]> =>
  httpCatch.get('/dashboard/health/chart', { params })
