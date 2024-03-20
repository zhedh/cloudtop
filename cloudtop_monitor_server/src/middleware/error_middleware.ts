import Koa, { Context } from 'koa'
import { print } from '../utils/print'
import { ApiError } from '../utils/response'

export const errorMiddleware =  async (ctx: Context, next: Koa.Next) => {
  const start = Date.now()

  try {
    await next()
  } catch (error) {
    if (error instanceof ApiError) {
      ctx.body = error
    } else {
      ctx.body = new ApiError(500000, '服务端异常', error)
    }

    print(error)
  }

  const ms = Date.now() - start
  print(`${ctx.method} ${ctx.url} - ${ms}`)
}
