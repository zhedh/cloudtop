import Router from 'koa-router'
import dayjs from 'dayjs'
import { ApiData } from '../../utils/response'
import { validateTimeRange } from '../../utils/validate'
import { territoryUserStat } from '../../services/dashboard'

const territoryRouter = new Router()

territoryRouter.get('/user/stat', async (ctx) => {
  const { projectCode, projectEnv } = ctx.state
  const { startTime, endTime } = ctx.request.query as Record<string, any>

  const message = validateTimeRange(startTime, endTime)
  if (message) {
    ctx.body = new ApiData(400200, message)
    return
  }

  ctx.body = await territoryUserStat({
    projectCode,
    projectEnv,
    startTime: dayjs(startTime),
    endTime: dayjs(endTime),
  })
})

export default territoryRouter
