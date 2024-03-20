import { Context } from 'koa'
import { ErrorData } from '../../types/log'
import { ApiData } from '../../utils/response'
import { dataKeyToLine } from '../../utils/format'
import { transformCommon } from './util'
import { createPool } from '../elastic'

enum ErrorCategory {
  Syntax = 'SyntaxError', // 解析过程语法错误
  Type = 'TypeError', // 不属于有效类型
  Reference = 'ReferenceError', // 无效引用
  Range = 'RangeError', // 数值超出有效范围
  URI = 'URIError', // 解析URI编码出错
  CUSTOM = 'CustomError', // 自定义错误
}

const transform = (ctx: Context, data: Record<string, any>): ErrorData => {
  const category = Object.values(ErrorCategory).includes(data.category)
    ? data.category
    : ErrorCategory.CUSTOM

  return dataKeyToLine({
    ...transformCommon(ctx, data),
    category,
    // msg 中可能含有特殊字符，需要转译
    msg: data.msg ?? '',
    stack: data.stack ?? '',
    file: data.file ?? '',
    line: data.line ?? 0,
    col: data.col ?? 0,
    error: data.error ?? '',
  })
}

export const reportError = async (ctx: Context, data: Record<string, any>) => {
  const record = transform(ctx, data)

  createPool.push(record)

  return new ApiData(0, 'OK')
}
