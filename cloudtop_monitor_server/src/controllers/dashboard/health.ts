import Router from 'koa-router'
import dayjs from 'dayjs'
import { ApiData } from '../../utils/response'
import Topic, { HealthChartType } from '../../services/topic'
import { validateTimeRange } from '../../utils/validate'

const healthRouter = new Router()

healthRouter.get('/score', async (ctx) => {
  const { projectCode, projectEnv } = ctx.state
  const { startTime, endTime } = ctx.request.query as Record<string, any>

  const message = validateTimeRange(startTime, endTime)
  if (message) {
    ctx.body = new ApiData(400200, message)
    return
  }

  ctx.body = await Topic.healthScore({
    projectCode,
    projectEnv,
    startTime: dayjs(startTime),
    endTime: dayjs(endTime),
  })
})

healthRouter.get('/chart', async (ctx) => {
  const { projectCode, projectEnv } = ctx.state
  const { startTime, endTime, type } = ctx.request.query as Record<string, any>

  const message = validateTimeRange(startTime, endTime)
  if (message) {
    ctx.body = new ApiData(400200, message)
    return
  }

  if (!Topic.HEALTH_CHART_TYPE_LIST.includes(type as HealthChartType)) {
    ctx.body = new ApiData(400400, 'type 参数类型不匹配！')
    return
  }

  ctx.body = await Topic.healthChart({
    projectCode,
    projectEnv,
    type,
    startTime: dayjs(startTime),
    endTime: dayjs(endTime),
  })
})

export default healthRouter
