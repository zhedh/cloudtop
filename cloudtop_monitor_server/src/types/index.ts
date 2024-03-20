import { Dayjs } from 'dayjs'

export interface PaginationParams {
  current: number
  pageSize: number
}

// 统计指标参数，时间
export interface StatParams {
  projectCode: string
  projectEnv?: string
  startTime: Dayjs
  endTime: Dayjs
}

// 统计指标参数，日期
export interface StatDateParams {
  projectCode: string
  projectEnv?: string
  startDate: Dayjs
  endDate: Dayjs
}
