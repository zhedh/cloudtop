import Koa, { Context } from 'koa'
import { ApiData } from '../utils/response'
import { validateTimeRange } from '../utils/validate'

export const projectValidate = () => {
  return async (ctx: Context, next: Koa.Next) => {
    const { projectCode } = ctx.state

    if (!projectCode) {
      ctx.body = new ApiData(400000, 'header project-code 参数不能为空！')
      return
    }

    await next()
  }
}

export const timeRangeValidate = () => {
  return async (ctx: Context, next: Koa.Next) => {
    const { startTime, endTime } = ctx.request.query as Record<string, any>

    const message = validateTimeRange(startTime, endTime)
    if (message) {
      ctx.body = new ApiData(400000, message)
      return
    }

    await next()
  }
}
