import Router from 'koa-router'
import {
  projectCreate,
  ProjectCreateData,
  projectList,
  ProjectQueryData,
  projectStat,
} from '../../services/project'
import { ProjectType } from '../../types/project'
import { ApiData } from '../../utils/response'
import dayjs from 'dayjs'

const projectRouter = new Router()

projectRouter.post('/list', async (ctx) => {
  ctx.body = await projectList(ctx.request.body as ProjectQueryData)
})

projectRouter.post('/create', async (ctx) => {
  const { projectType, projectCode, projectName } = ctx.request.body as Record<
    string,
    any
  >

  let flag = false
  for (const key in ProjectType) {
    if (ProjectType[key as keyof typeof ProjectType] === projectType)
      flag = true
  }

  if (!flag) {
    ctx.body = new ApiData(400000, 'projectType 参数类型不正确！')
    return
  }

  if (!projectCode) {
    ctx.body = new ApiData(400000, 'projectCode 参数不能为空！')
    return
  }

  if (!projectName) {
    ctx.body = new ApiData(400000, 'projectName 参数不能为空！')
    return
  }

  ctx.body = await projectCreate(ctx.request.body as ProjectCreateData)
    .then((data) => data)
    .catch((error) => error)
})

projectRouter.get('/stat', async (ctx) => {
  let { projectCode, startTime, endTime } = ctx.request.query as Record<
    string,
    any
  >

  if (!projectCode) {
    ctx.body = new ApiData(400000, 'projectCode 参数不能为空！')
    return
  }

  if (!startTime) {
    ctx.body = new ApiData(400000, 'startTime 参数不能为空！')
    return
  }

  if (!endTime) {
    ctx.body = new ApiData(400000, 'endTime 参数不能为空！')
    return
  }

  try {
    startTime = dayjs(startTime)
    endTime = dayjs(endTime)
  } catch (error) {
    ctx.body = new ApiData(400000, 'startTime 或 endTime 参数格式不正确！')
    return
  }

  ctx.body = await projectStat({
    projectCode,
    startTime,
    endTime,
  })
})

export default projectRouter
