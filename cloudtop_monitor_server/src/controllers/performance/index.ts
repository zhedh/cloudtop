import Router from 'koa-router'
import page from './page'
import api from './api'

const performanceRouter = new Router()

performanceRouter.use('/page', page.routes(), page.allowedMethods())
performanceRouter.use('/api', api.routes(), api.allowedMethods())

export default performanceRouter
