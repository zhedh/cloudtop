export enum LogType {
  PV = 'pv',
  ERROR = 'error',
  RESOURCE_ERROR = 'resource_error',
  PERF = 'perf',
  API = 'api',
}

export interface CommonData {
  pid: string // 应用ID或应用名称、标识应用唯一值
  type: LogType // 日志类型
  reportTime?: number // 上报时间
  env: string // 环境 -> prod
  ext?: string // 扩展字段，不要超过100个字符 -> String | JSON.stringify(ext)

  ct: string // 网络类型
  page: string // 页面 -> testing
  pvId: string // PV ID -> bkkRsrej4OFdv2d4yeb37Xb2R2Xp

  sid: string // Session ID
  sr: string // 屏幕分辨率
  src: string // 被监控目标地址
  uid: string // 用户ID
  vp: string // 页面大小
  loginId?: string // 用户登录账号
}

export interface PvData {
  type: LogType.PV
  dt: string // 文档标题
  dr: string // 文档Referrer
  de: string // 文档编码类型
  dpr: string // 屏幕像素比
  lang: string // 文档语言
  url: string // 页面链接
}

export interface ErrorData {
  type: LogType.ERROR // 日志类型
  category: string // 错误名称，默认为CustomError -> ReferenceError
  msg: string // 错误消息，最大支持1000个字符
  error: string // 错误详情 -> JSON.stringify(error)
  stack?: string // 错误堆栈信息，最大支持1000个字符
  file?: string // 报错JS所属文件
  line?: number // 报错发生行
  col?: number // 报错发生列
}

export interface ResourceErrorData {
  type: LogType.RESOURCE_ERROR // 日志类型
  src: string // 资源地址 -> http://example/unknown/picture.jpg
  nodeName: string // 发生错误的HTML节点类型 -> img
  xpath: string // 发生错误位置 -> html. > body. > img.
  resType: string // 错误资源类型 -> img
  resName: string // 错误资源名称 -> /unknown/picture.jpg
  domain: string // 错误资源域名 -> example
}

export interface PerfData {
  type: LogType.PERF // 日志类型
  dns: number // DNS连接耗时（毫秒，下面字段涉及到耗时的单位都是毫秒）
  tcp: number // TCP连接耗时
  ssl: number // SSL连接耗时
  ttfb: number // 网络请求耗时。等待接收响应的第一个字节所花费的时间
  trans: number // 数据传输耗时
  dom: number // DOM解析耗时
  res: number // 资源加载耗时
  firstbyte: number // First Byte时间
  fpt: number // 首次渲染时间
  tti: number // 首次可操作时间
  ready: number // HTML加载完成时间，即DOM Ready时间
  load: number // 从开始加载到完全加载时间
  // fmp: number // 首次有效绘制时间（暂时不用，使用lcp替代）
  lcp: number // 最大内容绘制时间
}

export interface ApiLogData {
  type?: LogType.API // 日志类型
  api: string // API地址
  success: 1 | 0 // 请求是否成功 1：成功 2：失败
  status: number // 请求返回状态码
  msg: string // 返回的消息体
  time?: number // API耗时，单位为ms
}

export type LogData =
  | PvData
  | ErrorData
  | ResourceErrorData
  | PerfData
  | ApiLogData
