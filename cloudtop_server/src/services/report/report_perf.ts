import { Context } from 'koa'
import { ApiData } from '../../utils/response'
import { dataKeyToLine } from '../../utils/format'
import { transformCommon } from './util'
import { PerfData } from '../../types/log'
import { logPool } from '../logstore'

const transform = (ctx: Context, data: Record<string, any>): PerfData => {
  return {
    ...transformCommon(ctx, data),
    dns: data.dns ?? 0, // DNS连接耗时（毫秒，下面字段涉及到耗时的单位都是毫秒）
    tcp: data.tcp ?? 0, // TCP连接耗时
    ssl: data.ssl ?? 0, // SSL连接耗时
    ttfb: data.ttfb ?? 0, // 网络请求耗时。等待接收响应的第一个字节所花费的时间
    trans: data.trans ?? 0, // 数据传输耗时
    dom: data.dom ?? 0, // DOM解析耗时
    res: data.res ?? 0, // 资源加载耗时
    firstbyte: data.firstbyte ?? 0, // First Byte时间
    fpt: data.fpt ?? 0, // 首次渲染时间
    tti: data.tti ?? 0, // 首次可操作时间
    ready: data.ready ?? 0, // HTML加载完成时间，即DOM Ready时间
    load: data.load ?? 0, // 从开始加载到完全加载时间
    // fmp: data. // 首次有效绘制时间
    lcp: data.lcp ?? 0, // 最大内容绘制时间
  }
}

export const reportPerf = async (ctx: Context, data: Record<string, any>) => {
  const record = transform(ctx, data)

  logPool.push(record)

  return new ApiData(0, 'OK')
}
