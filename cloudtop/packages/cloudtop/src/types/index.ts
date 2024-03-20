import { LogData } from './log'

export * from './log'

// 上报方式
export type ReportType = 'beacon' | 'img' | 'xhr'

// 环境类型
export type EnvType = 'production' | 'staging' | 'testing' | string

// 路由模式
export type RouteModeType = 'history' | 'hash'

export interface Config {
  baseURL: string // 埋点上报服务地址
  clientIp?: string // 客户端IP
  reportType?: ReportType // 埋点上报方式，默认使用 beacon，向下兼容使用 xhr
  projectId: string // 项目名称
  env: EnvType // 环境
  sessionId?: string
  loginId?: string
  extend?: string | Record<string, any> // 扩展字段
  routeMode?: RouteModeType // 路由模式
}

// 日志处理回调
export type LogCallback = (data: LogData) => void
