import Router from 'koa-router'
import errorJs from './js'
import errorApi from './api'
import errorResource from './resource'

const errorRouter = new Router()

errorRouter.use('/js', errorJs.routes(), errorJs.allowedMethods())
errorRouter.use('/api', errorApi.routes(), errorApi.allowedMethods())
errorRouter.use(
  '/resource',
  errorResource.routes(),
  errorResource.allowedMethods()
)

export default errorRouter
