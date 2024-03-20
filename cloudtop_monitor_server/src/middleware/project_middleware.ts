import Koa, { Context } from 'koa'

export const projectMiddleware = async (ctx: Context, next: Koa.Next) => {
  const { headers } = ctx.request

  ctx.state.projectCode = headers['project-code']
  ctx.state.projectEnv = headers['project-env']

  await next()
}
