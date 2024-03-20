import path from 'path'
import fs from 'fs'
import { Context } from 'koa'
import Router from 'koa-router'
import { report } from '../services/report'
import { ApiData, ApiError } from '../utils/response'

const router = new Router()

/**
 * GET 请求上报日志
 */
router.get('/', async (ctx: Context) => {
  const { query } = ctx.request

  await report(ctx, query)
    .then((r: ApiData) => (ctx.body = r))
    .catch((e: ApiError) => (ctx.body = e))
})

/**
 * POST 请求上报日志
 */
router.post('/', async (ctx: Context) => {
  let { body } = ctx.request
  if (!body) ctx.body = new ApiError(4000, '参数为空')

  // body 实体为字符串，需要转成 json 对象
  body = typeof body === 'string' ? JSON.parse(body) : body

  await report(ctx, body as Record<string, any>)
    .then((r: ApiData) => (ctx.body = r))
    .catch((e: ApiError) => (ctx.body = e))
})

/**
 * POST 图片上报日志
 */
router.get('/log.png', async (ctx: Context) => {
  const { data } = ctx.request.query || {}
  await report(ctx, JSON.parse(data as string))

  // 返回图片
  const filePath = path.join(__dirname, '../assets/log.png')
  const file = fs.readFileSync(filePath)

  ctx.set('content-type', 'image/png')
  ctx.body = file
})

export default router
