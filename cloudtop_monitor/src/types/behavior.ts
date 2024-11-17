export enum BehaviorType {
  PV = 'pv',
  ERROR = 'error',
  RESOURCE_ERROR = 'resource_error',
  API = 'api',
}

export interface Behavior {
  id: string
  pid: string // 项目标识，对应 projectCode
  type: BehaviorType // 日志类型
  reportTime: number // 发生时间（毫秒）
  uid: string
  loginId: string
  url: string // 网址
  page: string // 页面
  api?: string // 接口访问地址
}
