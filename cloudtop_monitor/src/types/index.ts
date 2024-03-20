export interface PaginationParams {
  current: number
  pageSize: number
}

export interface PaginationProps {
  total?: number
  current: number
  pageSize: number
}

export interface ListData<T> {
  records: T[]
  pagination: PaginationProps
}

export interface ResponseData<T> {
  code: string | number
  msg: string
  result: T
  [name: string]: unknown
}

export interface ApiResponse<T> extends Promise<ResponseData<T>> {}

export interface ApiListData<T> extends ApiResponse<ListData<T>> {}

export interface ChartRecord {
  key: string
  value: number
}

// 统计指标参数
export interface StatParams {
  startTime: string | number // 有效的时间格式或时间戳
  endTime: string | number // 有效的时间格式或时间戳
}

export interface StatDateParams {
  startDate: string | number // 有效的时间格式或时间戳
  endDate: string | number // 有效的时间格式或时间戳
}
