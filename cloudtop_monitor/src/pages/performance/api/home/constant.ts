import { formatPercent } from '../../../../utils/format'
import { TimeInterval } from './types'

export const API_STAT_LIST = [
  {
    type: 'total',
    label: '请求总量',
    value: 0,
    unit: '',
    ratio: 0,
    desc: '',
  },
  {
    type: 'time',
    label: '平均耗时',
    value: 0,
    unit: 'ms',
    ratio: 0,
    desc: '',
    formatValue: (value: number) => value?.toFixed(2),
  },
  {
    type: 'success',
    label: '成功率',
    value: 0,
    unit: '%',
    ratio: 0,
    desc: '请求成功数 / 请求总数。',
    formatValue: (value: number) => formatPercent(value),
  },
  {
    type: 'slow',
    label: '迟缓率',
    value: 0,
    unit: '%',
    ratio: 0,
    desc: '请求耗时 > 1000ms 的次数占比。',
    formatValue: (value: number) => formatPercent(value),
  },
]

export const PAGE_PERF_LIST = [
  {
    key: 'dns',
    name: 'DNS查询',
  },
  {
    key: 'tcp',
    name: 'TCP连接',
  },
  {
    key: 'ssl',
    name: 'SSl建连',
  },
  {
    key: 'ttfb',
    name: '请求响应',
  },
  {
    key: 'trans',
    name: '内容传输',
  },
  {
    key: 'dom',
    name: 'DOM解析',
  },
  {
    key: 'res',
    name: '资源加载',
  },
]

export const API_PERF_DATA_LIST = [
  {
    key: 'count',
    name: '请求总量',
    type: 'bar',
  },
  {
    key: 'successCount',
    name: '成功次数',
    type: 'bar',
    stack: 'Count',
  },
  {
    key: 'errorCount',
    name: '错误次数',
    type: 'bar',
    stack: 'Count',
  },
  {
    key: 'slowCount',
    name: '缓慢次数',
    type: 'bar',
  },
  {
    key: 'time',
    name: '平均耗时',
    type: 'line',
    formatter(value: number) {
      return value?.toFixed(2) + 'ms'
    },
  },
  {
    key: 'successRatio',
    name: '成功率',
    type: 'line',
    // formatter(value: number) {
    //   return formatPercent(value) + '%'
    // },
  },
  {
    key: 'slowRatio',
    name: '迟缓率',
    type: 'line',
    // formatter(value: number) {
    //   return formatPercent(value) + '%'
    // },
  },
]

export const TIME_INTERVALS = [
  {
    label: '分钟',
    value: TimeInterval.MINUTE,
  },
  {
    label: '小时',
    value: TimeInterval.HOUR,
  },
  {
    label: '天',
    value: TimeInterval.DAY,
  },
]
