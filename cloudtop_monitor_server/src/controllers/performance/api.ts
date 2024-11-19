import Router from 'koa-router'
import { ApiData } from '../../utils/response'
import dayjs from 'dayjs'
import { timeRangeValidate } from '../hepler'
import Topic from '../../services/topic'

const performanceApiRouter = new Router()

/**
 * 接口时间区间参数校验
 */
performanceApiRouter.use(
  ['/stat', '/list', 'data', '/distribution', '/terminal', 'territory'],
  timeRangeValidate()
)

performanceApiRouter.get('/stat', async (ctx) => {
  const { projectCode, projectEnv } = ctx.state
  const { startTime, endTime } = ctx.request.query as Record<string, any>

  ctx.body = await Topic.performanceApiStats({
    projectCode,
    projectEnv,
    startTime: dayjs(startTime),
    endTime: dayjs(endTime),
  })
})

performanceApiRouter.get('/data', async (ctx) => {
  const { projectCode, projectEnv } = ctx.state
  const { startTime, endTime, timeInterval } = ctx.request.query as Record<
    string,
    any
  >

  ctx.body = await Topic.performanceApiData({
    projectCode,
    projectEnv,
    startTime: dayjs(startTime),
    endTime: dayjs(endTime),
    timeInterval: isNaN(+timeInterval) ? 60 * 60 * 24 : +timeInterval,
  })
})

performanceApiRouter.get('/list', async (ctx) => {
  const { projectCode, projectEnv } = ctx.state
  const { startTime, endTime, api } = ctx.request.query as Record<string, any>

  if (api && typeof api !== 'string') {
    ctx.body = new ApiData(400400, 'api 参数不正确')
    return
  }

  ctx.body = await Topic.performanceApiList({
    projectCode,
    projectEnv,
    startTime: dayjs(startTime),
    endTime: dayjs(endTime),
    api,
  })
})

performanceApiRouter.get('/distribution', async (ctx) => {
  const { projectCode, projectEnv } = ctx.state
  const { startTime, endTime, interval } = ctx.request.query as Record<
    string,
    any
  >

  ctx.body = await Topic.performanceApiDistribution({
    projectCode,
    projectEnv,
    startTime: dayjs(startTime),
    endTime: dayjs(endTime),
    interval: isNaN(interval) ? 20 : interval,
  })
})

performanceApiRouter.get('/terminal', async (ctx) => {
  const { projectCode, projectEnv } = ctx.state
  const { startTime, endTime, terminalType } = ctx.request.query as Record<
    string,
    any
  >

  const FILED_TYPES = ['ct', 'os', 'browser']
  if (!FILED_TYPES.includes(terminalType)) {
    ctx.body = new ApiData(400400, 'terminalType 参数不正确')
    return
  }

  ctx.body = await Topic.performanceApiTerminal({
    projectCode,
    projectEnv,
    startTime: dayjs(startTime),
    endTime: dayjs(endTime),
    terminalType: terminalType,
  })
})

performanceApiRouter.get('/territory', async (ctx) => {
  const { projectCode, projectEnv } = ctx.state
  const { startTime, endTime } = ctx.request.query as Record<string, any>

  ctx.body = await Topic.performanceApiTerritory({
    projectCode,
    projectEnv,
    startTime: dayjs(startTime),
    endTime: dayjs(endTime),
  })
})

export default performanceApiRouter
