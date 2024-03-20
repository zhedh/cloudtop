import { ApiResponse, StatParams } from '../../../types'
import { httpCatch } from '../../../utils/http'

export interface PerformanceApiTimeRecord {
  key: string
  count: number
  from: number
  to: number
}

export interface PerformanceApiTerminalRecord {
  key: string
  count: number
  times: PerformanceApiTimeRecord[]
}

export const performanceApiTerminal = (
  params: { terminalType: string } & StatParams
): ApiResponse<PerformanceApiTerminalRecord[]> =>
  httpCatch.get('/performance/api/terminal', { params })
