import dayjs from 'dayjs'
import Router from 'koa-router'
import { ApiData } from '../../utils/response'
import { validateDateRange, validateTimeRange } from '../../utils/validate'
import Topic from '../../services/topic'

const errorJsRouter = new Router()

errorJsRouter.get('/overview', async (ctx) => {
  const { projectCode, projectEnv } = ctx.state
  const { startDate, endDate } = ctx.request.query as Record<string, any>

  const message = validateDateRange(startDate, endDate)
  if (message) {
    ctx.body = new ApiData(400400, message)
    return
  }

  ctx.body = await Topic.errorJsOverview({
    projectCode,
    projectEnv,
    startDate: dayjs(startDate),
    endDate: dayjs(endDate),
  })
})

errorJsRouter.get('/chart', async (ctx) => {
  const { projectCode, projectEnv } = ctx.state
  const { startTime, endTime } = ctx.request.query as Record<string, any>

  const message = validateTimeRange(startTime, endTime)
  if (message) {
    ctx.body = new ApiData(400400, message)
    return
  }

  ctx.body = await Topic.errorJsChart({
    projectCode,
    projectEnv,
    startTime: dayjs(startTime),
    endTime: dayjs(endTime),
  })
})

errorJsRouter.get('/toplist', async (ctx) => {
  const { projectCode, projectEnv } = ctx.state
  let { startTime, endTime } = ctx.request.query as Record<string, any>

  const message = validateTimeRange(startTime, endTime)
  if (message) {
    ctx.body = new ApiData(400400, message)
    return
  }

  ctx.body = await Topic.errorJsToplist({
    projectCode,
    projectEnv,
    startTime: dayjs(startTime),
    endTime: dayjs(endTime),
  })
})

export default errorJsRouter
