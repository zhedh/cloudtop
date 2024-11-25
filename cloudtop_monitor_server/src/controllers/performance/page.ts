import Router from 'koa-router'
import { ApiData } from '../../utils/response'
import dayjs from 'dayjs'
import { timeRangeValidate } from '../hepler'
import Topic from '../../services/topic'

const performancePageRouter = new Router()

/**
 * 接口时间区间参数校验
 */
performancePageRouter.use(
  ['/stat', '/list', '/waterfall', '/territory'],
  timeRangeValidate()
)

performancePageRouter.get('/stat', async (ctx) => {
  const { projectCode, projectEnv } = ctx.state
  const { startTime, endTime } = ctx.request.query as Record<string, any>

  ctx.body = await Topic.performancePageStats({
    projectCode,
    projectEnv,
    startTime: dayjs(startTime),
    endTime: dayjs(endTime),
  })
})

performancePageRouter.get('/data', async (ctx) => {
  const { projectCode, projectEnv } = ctx.state
  const { startTime, endTime, timeInterval } = ctx.request.query as Record<
    string,
    any
  >

  ctx.body = await Topic.performancePageData({
    projectCode,
    projectEnv,
    startTime: dayjs(startTime),
    endTime: dayjs(endTime),
    timeInterval: isNaN(+timeInterval) ? 60 * 60 * 24 : +timeInterval,
  })
})

performancePageRouter.get('/list', async (ctx) => {
  const { projectCode, projectEnv } = ctx.state
  const { startTime, endTime, page } = ctx.request.query as Record<string, any>

  if (page && typeof page !== 'string') {
    ctx.body = new ApiData(400400, 'page 参数不正确')
    return
  }

  ctx.body = await Topic.performancePageList({
    projectCode,
    projectEnv,
    startTime: dayjs(startTime),
    endTime: dayjs(endTime),
    page,
  })
})

performancePageRouter.get('/waterfall', async (ctx) => {
  const { projectCode, projectEnv } = ctx.state
  const { startTime, endTime, page } = ctx.request.query as Record<string, any>

  if (page && typeof page !== 'string') {
    ctx.body = new ApiData(400400, 'page 参数不正确')
    return
  }

  ctx.body = await Topic.performancePageWaterfall({
    projectCode,
    projectEnv,
    startTime: dayjs(startTime),
    endTime: dayjs(endTime),
    page,
  })
})

performancePageRouter.get('/ratio', async (ctx) => {
  const { projectCode, projectEnv } = ctx.state
  const { startTime, endTime, fieldType } = ctx.request.query as Record<
    string,
    any
  >

  const FILED_TYPES = ['ct', 'os', 'browser']
  if (!FILED_TYPES.includes(fieldType)) {
    ctx.body = new ApiData(400400, 'fieldType 参数不正确')
    return
  }

  ctx.body = await Topic.performancePageRatio({
    projectCode,
    projectEnv,
    startTime: dayjs(startTime),
    endTime: dayjs(endTime),
    fieldType: fieldType,
  })
})

performancePageRouter.get('/territory', async (ctx) => {
  const { projectCode, projectEnv } = ctx.state
  const { startTime, endTime } = ctx.request.query as Record<string, any>

  ctx.body = await Topic.performancePageTerritory({
    projectCode,
    projectEnv,
    startTime: dayjs(startTime),
    endTime: dayjs(endTime),
  })
})

export default performancePageRouter
