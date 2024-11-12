import { Context } from 'koa'
import { ApiData } from '../../utils/response'
import { dataKeyToLine } from '../../utils/format'
import { transformCommon } from './util'
import { ApiLogData, PerfData } from '../../types/log'
import { logPool } from '../logstore'

const transform = (ctx: Context, data: Record<string, any>): ApiLogData => {
  return {
    ...transformCommon(ctx, data),
    api: data.api ?? '', // API地址
    success: data.success ?? 1, // 请求是否成功 1：成功 0：失败
    status: data.status ?? 0, // 请求返回状态码
    msg: data.msg ?? '', // 返回的消息体
    time: data.time ?? 0, // API耗时，单位为ms
  }
}

export const reportApi = async (ctx: Context, data: Record<string, any>) => {
  const record = transform(ctx, data)

  logPool.push(record)

  return new ApiData(0, 'OK')
}
