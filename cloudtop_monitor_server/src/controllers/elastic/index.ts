import Router from 'koa-router'
import { count, search } from '../../services/elastic'

const elasticRouter = new Router()

elasticRouter.post('/search', async (ctx) => {
  const { body } = ctx.request
  const { size, from } = ctx.request.query

  ctx.body = await search(
    body as Record<string, any>,
    +(size ?? 1000),
    +(from ?? 0)
  )
})

elasticRouter.post('/count', async (ctx) => {
  const { body } = ctx.request

  ctx.body = await count(body as Record<string, any>)
})

export default elasticRouter
