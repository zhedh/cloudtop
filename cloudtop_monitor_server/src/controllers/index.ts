import Router from 'koa-router'
import elastic from './elastic'
import project from './project'
import dashboard from './dashboard'
import behavior from './behavior'
import error from './error'
import performance from './performance'
import { projectValidate } from './hepler'

const router = new Router()

/**
 * 接口应用参数校验
 */
router.use(
  ['/dashboard', '/error', '/behavior', '/performance'],
  projectValidate()
)

router.use('/elastic', elastic.routes(), elastic.allowedMethods())
router.use('/project', project.routes(), project.allowedMethods())
router.use('/dashboard', dashboard.routes(), dashboard.allowedMethods())
router.use('/behavior', behavior.routes(), behavior.allowedMethods())
router.use('/error', error.routes(), error.allowedMethods())
router.use('/performance', performance.routes(), performance.allowedMethods())

export default router
