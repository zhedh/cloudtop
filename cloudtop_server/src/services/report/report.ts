import { Context } from 'koa'
import { LogType } from '../../types/log'
import { ApiError } from '../../utils/response'
import { reportError } from './report_error'
import { reportResourceError } from './report_resource_error'
import { reportPV } from './report_pv'
import { reportPerf } from './report_perf'
import { reportApi } from './report_api'

export const report = async (ctx: Context, data: Record<string, any> = {}) => {
  const { pid, type } = data

  // 应用名称校验
  if (!pid) throw new ApiError(4000, '日志应用未定义')

  // 日志类型分类处理
  switch (type) {
    case LogType.PV:
      return reportPV(ctx, data)

    case LogType.ERROR:
      return reportError(ctx, data)

    case LogType.RESOURCE_ERROR:
      return reportResourceError(ctx, data)

    case LogType.PERF:
      return reportPerf(ctx, data)

    case LogType.API:
      return reportApi(ctx, data)

    default:
      throw new ApiError(4000, '日志类型未定义')
  }
}
