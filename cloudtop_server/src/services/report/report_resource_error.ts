import { Context } from 'koa'
import { ErrorData } from '../../types/log'
import { ApiData } from '../../utils/response'
import { dataKeyToLine } from '../../utils/format'
import { transformCommon } from './util'
import { createPool } from '../elastic'

const transform = (ctx: Context, data: Record<string, any>): ErrorData => {
  return dataKeyToLine({
    ...transformCommon(ctx, data),

    src: data.src ?? '',
    nodeName: data.nodeName ?? '',
    xpath: data.xpath ?? '',
    resType: data.resType ?? '',
    resName: data.resName ?? '',
    domain: data.domain ?? '',
  })
}

export const reportResourceError = async (
  ctx: Context,
  data: Record<string, any>
) => {
  const record = transform(ctx, data)

  createPool.push(record)

  return new ApiData(0, 'OK')
}
