import { TimeInterval } from './types'

export const PAGE_STAT_LIST = [
  {
    type: 'ttfb',
    label: '首字节',
    value: 0,
    unit: 'ms',
    ratio: 0,
  },
  {
    type: 'ready',
    label: 'DOM Ready',
    value: 0,
    unit: 'ms',
    ratio: 0,
  },
  {
    type: 'load',
    label: '页面完全加载',
    value: 0,
    unit: 'ms',
    ratio: 0,
  },
  {
    type: 'lcp',
    label: '最大内容绘制',
    value: 0,
    unit: 'ms',
    ratio: 0,
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

export const PAGE_PERF_DATA_LIST = [
  {
    key: 'dns',
    name: 'DNS查询',
  },
  {
    key: 'ready',
    name: 'DOM Ready',
  },
  {
    key: 'load',
    name: '页面完全加载',
  },
  {
    key: 'lcp',
    name: '最大内容绘制',
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
