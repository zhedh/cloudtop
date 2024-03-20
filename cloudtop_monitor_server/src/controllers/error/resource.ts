import dayjs from 'dayjs'
import { ApiData } from '../../utils/response'
import {
  errorResourceOverview,
  errorResourceStat,
  errorResourceToplist,
} from '../../services/error'
import Router from 'koa-router'
import { validateDateRange, validateTimeRange } from '../../utils/validate'

const errorResourceRouter = new Router()

errorResourceRouter.get('/overview', async (ctx) => {
  const { projectCode, projectEnv } = ctx.state
  const { startDate, endDate } = ctx.request.query as Record<string, any>

  const message = validateDateRange(startDate, endDate)
  if (message) {
    ctx.body = new ApiData(400400, message)
    return
  }

  ctx.body = await errorResourceOverview({
    projectCode,
    projectEnv,
    startDate: dayjs(startDate),
    endDate: dayjs(endDate),
  })
})

errorResourceRouter.get('/stat', async (ctx) => {
  const { projectCode, projectEnv } = ctx.state
  const { startTime, endTime } = ctx.request.query as Record<string, any>

  const message = validateTimeRange(startTime, endTime)
  if (message) {
    ctx.body = new ApiData(400400, message)
    return
  }

  ctx.body = await errorResourceStat({
    projectCode,
    projectEnv,
    startTime: dayjs(startTime),
    endTime: dayjs(endTime),
  })
})

errorResourceRouter.get('/toplist', async (ctx) => {
  const { projectCode, projectEnv } = ctx.state
  const { startTime, endTime } = ctx.request.query as Record<string, any>

  const message = validateTimeRange(startTime, endTime)
  if (message) {
    ctx.body = new ApiData(400400, message)
    return
  }

  ctx.body = await errorResourceToplist({
    projectCode,
    projectEnv,
    startTime: dayjs(startTime),
    endTime: dayjs(endTime),
  })
})

export default errorResourceRouter
