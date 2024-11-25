import Router from 'koa-router'
import dayjs from 'dayjs'
import { ApiData } from '../../utils/response'
import Topic from '../../services/topic'
import { validateTimeRange } from '../../utils/validate'

const overviewRouter = new Router()

overviewRouter.get('/flow', async (ctx) => {
  const { projectCode, projectEnv } = ctx.state
  let { startTime, endTime } = ctx.request.query as Record<string, any>

  const message = validateTimeRange(startTime, endTime)
  if (message) {
    ctx.body = new ApiData(400200, message)
    return
  }

  ctx.body = await Topic.overviewFlow({
    projectCode,
    projectEnv,
    startTime: dayjs(startTime),
    endTime: dayjs(endTime),
  })
})

overviewRouter.get('/chart/core', async (ctx) => {
  const { projectCode, projectEnv } = ctx.state
  let { startTime, endTime } = ctx.request.query as Record<string, any>

  const message = validateTimeRange(startTime, endTime)
  if (message) {
    ctx.body = new ApiData(400200, message)
    return
  }

  ctx.body = await Topic.overviewCoreChart({
    projectCode,
    projectEnv,
    startTime: dayjs(startTime),
    endTime: dayjs(endTime),
  })
})

overviewRouter.get('/chart/synthetic', async (ctx) => {
  const { projectCode, projectEnv } = ctx.state
  let { startTime, endTime } = ctx.request.query as Record<string, any>

  const message = validateTimeRange(startTime, endTime)
  if (message) {
    ctx.body = new ApiData(400200, message)
    return
  }

  ctx.body = await Topic.overviewSyntheticChart({
    projectCode,
    projectEnv,
    startTime: dayjs(startTime),
    endTime: dayjs(endTime),
  })
})

export default overviewRouter
