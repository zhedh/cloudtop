import Router from 'koa-router'
import overview from './overview'
import health from './health'
import performance from './performance'
import territory from './territory'

const dashboardRouter = new Router()

dashboardRouter.use('/overview', overview.routes(), overview.allowedMethods())
dashboardRouter.use('/health', health.routes(), health.allowedMethods())
dashboardRouter.use(
  '/performance',
  performance.routes(),
  performance.allowedMethods()
)
dashboardRouter.use(
  '/territory',
  territory.routes(),
  territory.allowedMethods()
)

export default dashboardRouter
