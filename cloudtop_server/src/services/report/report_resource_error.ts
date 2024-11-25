import { Context } from 'koa'
import { ApiData } from '../../utils/response'
import { transformCommon } from './util'
import { logPool } from '../logstore'
import { ResourceErrorData } from '../../types/log'

const transform = (ctx: Context, data: Record<string, any>): ResourceErrorData => {
  return {
    ...transformCommon(ctx, data),

    src: data.src ?? '',
    nodeName: data.nodeName ?? '',
    xpath: data.xpath ?? '',
    resType: data.resType ?? '',
    resName: data.resName ?? '',
    domain: data.domain ?? '',
  }
}

export const reportResourceError = async (
  ctx: Context,
  data: Record<string, any>
) => {
  const record = transform(ctx, data)

  logPool.push(record)

  return new ApiData(0, 'OK')
}
