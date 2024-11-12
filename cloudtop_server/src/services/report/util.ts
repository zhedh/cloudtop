import { Context } from 'koa'
import { CommonData } from '../../types/log'
import { ipLocation } from '../../utils/ip'
import { uaParser } from '../../utils/ua'

export const transformCommon = (
  ctx: Context,
  data: Record<string, any>
): CommonData => {
  const { header = {} } = ctx.request
  const createTime = +new Date()
  const location = ipLocation(data.clientIp || ctx.request.ip)
  const uaInfo = uaParser(header['user-agent']!)

  console.log("header['user-agent']: ", header['user-agent'])
  console.log("data.reportTime: ", data.reportTime)

  return {
    pid: data.pid ?? '',
    type: data.type ?? '',
    env: data.env ?? '',
    reportTime: data.reportTime ? +data.reportTime : undefined,
    date: createTime,

    ct: data.ct ?? 'unknown',
    httpReferer: header.referer ?? '',
    httpUserAgent: header['user-agent'] ?? '',
    ...uaInfo, // UA 信息
    ...location, // IP 定位信息

    sid: data.sid ?? '',
    pvId: data.pvId ?? '',
    page: data.page ?? '',
    url: data.url ?? header.origin ?? '',
    sr: data.sr ?? '',
    vp: data.vp ?? '',
    uid: data.uid ?? '',

    loginId: data.loginId ?? '',
  }
}
