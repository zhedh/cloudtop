export enum OverviewFlowType {
  PV = 'pv', // 浏览量
  UV = 'uv', // 访客数
  NEW_UV = 'newUv', // 新访客
  IP = 'ip', // IP 数
  FREQUENCY = 'frequency', // 频次（人均）
  BOUNCE = 'bounce', // 跳出率
}

export enum OverviewChartType {
  PV = 'pv', // 浏览量
  UV = 'uv', // 访客数
}

export enum HealthRecordType {
  ERROR = 'error',
  RESOURCE_ERROR = 'resource_error',
  API_ERROR = 'api_error',
}
