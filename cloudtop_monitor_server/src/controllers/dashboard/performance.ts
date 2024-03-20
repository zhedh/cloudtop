import Router from 'koa-router'
import dayjs from 'dayjs'
import { ApiData } from '../../utils/response'
import {
  performanceApiChart,
  performanceApiStat,
  performanceApiTopList,
  performancePageNetworkChart,
  performancePageStat,
  performancePageTopList,
} from '../../services/dashboard'
import { validateTimeRange } from '../../utils/validate'

const performanceRouter = new Router()

performanceRouter.get('/page/stat', async (ctx) => {
  const { projectCode, projectEnv } = ctx.state
  let { startTime, endTime } = ctx.request.query as Record<string, any>

  const message = validateTimeRange(startTime, endTime)
  if (message) {
    ctx.body = new ApiData(400200, message)
    return
  }

  startTime = dayjs(startTime)
  endTime = dayjs(endTime)
  ctx.body = await performancePageStat({
    projectCode,
    projectEnv,
    startTime,
    endTime,
  })
})

performanceRouter.get('/page/network/chart', async (ctx) => {
  const { projectCode, projectEnv } = ctx.state
  const { startTime, endTime } = ctx.request.query as Record<string, any>

  const message = validateTimeRange(startTime, endTime)
  if (message) {
    ctx.body = new ApiData(400400, message)
    return
  }

  ctx.body = await performancePageNetworkChart({
    projectCode,
    projectEnv,
    startTime: dayjs(startTime),
    endTime: dayjs(endTime),
  })
})

performanceRouter.get('/page/top/list', async (ctx) => {
  const { projectCode, projectEnv } = ctx.state
  const { startTime, endTime } = ctx.request.query as Record<string, any>

  const message = validateTimeRange(startTime, endTime)
  if (message) {
    ctx.body = new ApiData(400200, message)
    return
  }

  ctx.body = await performancePageTopList({
    projectCode,
    projectEnv,
    startTime: dayjs(startTime),
    endTime: dayjs(endTime),
  })
})

performanceRouter.get('/api/stat', async (ctx) => {
  const { projectCode, projectEnv } = ctx.state
  const { startTime, endTime } = ctx.request.query as Record<string, any>

  const message = validateTimeRange(startTime, endTime)
  if (message) {
    ctx.body = new ApiData(400200, message)
    return
  }

  ctx.body = await performanceApiStat({
    projectCode,
    projectEnv,
    startTime: dayjs(startTime),
    endTime: dayjs(endTime),
  })
})

performanceRouter.get('/api/chart', async (ctx) => {
  const { projectCode, projectEnv } = ctx.state
  const { startTime, endTime } = ctx.request.query as Record<string, any>

  const message = validateTimeRange(startTime, endTime)
  if (message) {
    ctx.body = new ApiData(400200, message)
    return
  }

  ctx.body = await performanceApiChart({
    projectCode,
    projectEnv,
    startTime: dayjs(startTime),
    endTime: dayjs(endTime),
  })
})

performanceRouter.get('/api/top/list', async (ctx) => {
  const { projectCode, projectEnv } = ctx.state
  const { startTime, endTime } = ctx.request.query as Record<string, any>

  const message = validateTimeRange(startTime, endTime)
  if (message) {
    ctx.body = new ApiData(400200, message)
    return
  }

  ctx.body = await performanceApiTopList({
    projectCode,
    projectEnv,
    startTime: dayjs(startTime),
    endTime: dayjs(endTime),
  })
})

export default performanceRouter
