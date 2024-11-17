import Router from 'koa-router'
import dayjs from 'dayjs'
import { ApiData } from '../../utils/response'
import { validateTimeRange } from '../../utils/validate'
import Topic from '../../services/topic'

const behaviorRouter = new Router()

behaviorRouter.get('/list', async (ctx) => {
  const { projectCode, projectEnv } = ctx.state
  const { startTime, endTime, keyword, current, pageSize } = ctx.request.query as Record<
    string,
    any
  >

  const message = validateTimeRange(startTime, endTime)
  if (message) {
    ctx.body = new ApiData(400200, message)
    return
  }

  ctx.body = await Topic.behaviorList({
    projectCode,
    projectEnv,
    keyword,
    startTime: dayjs(startTime),
    endTime: dayjs(endTime),
    current: +(current ?? 1),
    pageSize: +(pageSize ?? 20),
  })
})

behaviorRouter.get('/detail/list', async (ctx) => {
  const { projectCode, projectEnv } = ctx.state
  const { startTime, endTime, uid, type } = ctx.request.query as Record<
    string,
    any
  >

  const message = validateTimeRange(startTime, endTime)
  if (message) {
    ctx.body = new ApiData(400200, message)
    return
  }

  if (!uid) {
    ctx.body = new ApiData(400300, 'uid 参数不能为空！')
    return
  }

  ctx.body = await Topic.behaviorDetailList({
    projectCode,
    projectEnv,
    uid,
    type,
    startTime: dayjs(startTime),
    endTime: dayjs(endTime),
  })
})

export default behaviorRouter
