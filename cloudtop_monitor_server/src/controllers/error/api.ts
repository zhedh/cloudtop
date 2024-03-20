import Router from 'koa-router'
import dayjs from 'dayjs'
import { ApiData } from '../../utils/response'
import { validateDateRange, validateTimeRange } from '../../utils/validate'
import {
  errorApiChartOverview,
  errorApiStatDate,
  errorApiTopList,
} from '../../services/error'

const errorApiRouter = new Router()

errorApiRouter.get('/chart/overview', async (ctx) => {
  const { projectCode, projectEnv } = ctx.state
  const { startDate, endDate } = ctx.request.query as Record<string, any>

  const message = validateDateRange(startDate, endDate)
  if (message) {
    ctx.body = new ApiData(400400, message)
    return
  }

  ctx.body = await errorApiChartOverview({
    projectCode,
    projectEnv,
    startDate: dayjs(startDate),
    endDate: dayjs(endDate),
  })
})

errorApiRouter.get('/stat/date', async (ctx) => {
  const { projectCode, projectEnv } = ctx.state
  let { startTime, endTime } = ctx.request.query as Record<string, any>

  const message = validateTimeRange(startTime, endTime)
  if (message) {
    ctx.body = new ApiData(400400, message)
    return
  }

  startTime = dayjs(startTime)
  endTime = dayjs(endTime)
  ctx.body = await errorApiStatDate({
    projectCode,
    projectEnv,
    startTime,
    endTime,
  })
})

errorApiRouter.get('/top/list', async (ctx) => {
  const { projectCode, projectEnv } = ctx.state
  let { startTime, endTime, order, sort } = ctx.request.query as Record<
    string,
    any
  >

  const message = validateTimeRange(startTime, endTime)
  if (message) {
    ctx.body = new ApiData(400400, message)
    return
  }

  if (sort && !['date', 'count'].includes(sort)) {
    ctx.body = new ApiData(400400, 'sort 参数不正确！')
    return
  }

  if (order && !['asc', 'desc'].includes(order)) {
    ctx.body = new ApiData(400400, 'order 参数不正确！')
    return
  }

  startTime = dayjs(startTime)
  endTime = dayjs(endTime)

  ctx.body = await errorApiTopList({
    projectCode,
    projectEnv,
    startTime,
    endTime,
    order,
    sort,
  })
})

export default errorApiRouter
