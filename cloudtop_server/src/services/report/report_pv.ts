import { Context } from 'koa'
import { ApiData } from '../../utils/response'
import { transformCommon } from './util'
import { PvData } from '../../types/log'
import { logPool } from '../logstore'

const transform = (ctx: Context, data: Record<string, any>): PvData => {
  return {
    ...transformCommon(ctx, data),
    dt: data.dt, // 文档标题
    dr: data.dr, // 文档Referrer
    de: data.de, // 文档编码类型
    dpr: data.dpr, // 屏幕像素比
    lang: data.lang, // 文档语言
    url: data.url, // 页面链接
  }
}

export const reportPV = async (ctx: Context, data: Record<string, any>) => {
  const record = transform(ctx, data)

  logPool.push(record)
  
  return new ApiData(0, 'OK')
}
