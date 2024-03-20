import { HealthRecordType } from '../../../types/dashboard'

export const SCORE_RECORD_TYPE_MAP = {
  [HealthRecordType.ERROR]: {
    label: 'JS错误率',
    path: '/monitor/error/error',
  },
  [HealthRecordType.RESOURCE_ERROR]: {
    label: '静态资源异常',
    path: '/monitor/error/resource',
  },
  [HealthRecordType.API_ERROR]: {
    label: '接口异常',
    path: '/monitor/error/error', // TODO 接口异常
  },
}

export const HEALTH_CHART_OPTIONS = [
  {
    value: HealthRecordType.ERROR,
    label: 'JS错误率',
    path: '/monitor/error/error',
  },
  {
    value: HealthRecordType.RESOURCE_ERROR,
    label: '静态资源异常',
    path: '/monitor/error/resource',
  },
  {
    value: HealthRecordType.API_ERROR,
    label: '接口异常',
    path: '/monitor/error/error', // TODO 接口异常
  },
]
