import { ApiResponse, StatParams } from '../../../types'
import { httpCatch } from '../../../utils/http'

interface PerformancePageRadioRecord {
  key: string
  count: number
  dns: number
  tcp: number
  ssl: number
  ttfb: number
  trans: number
  dom: number
  res: number
}

export interface PerformancePageRadioData {
  total: number
  records: PerformancePageRadioRecord[]
}

export const performancePageRadio = (
  params: { fieldType: string } & StatParams
): ApiResponse<PerformancePageRadioData> =>
  httpCatch.get('/performance/page/ratio', { params })
