// 注入环境变量
import dotenv from 'dotenv'
import path from 'path'

dotenv.config()
dotenv.config({
  path: path.resolve(
    process.cwd(),
    process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env'
  ),
  override: true,
})

import Koa, { Context } from 'koa'
import cors from 'koa2-cors'
import bodyParser from 'koa-bodyparser'

import appConfig from './config/app'
import router from './controllers'
import { initDB } from './database/mysql'
import { initES } from './database/elastic'
import { LogstoreType } from './types/base'

const bootstrap = async () => {
  // 数据库初始化
  await initDB()

  // ES 索引初始化
  if (process.env.CLOUDTOP_LOGSTORE_TYPE === LogstoreType.ELASTIC) {
    await initES()
  }

  const app = new Koa()
    .use(
      cors({
        origin: (ctx: Context) => ctx.request.header.origin!,
        maxAge: 5, // 指定本次预检请求的有效期，单位为秒。
        credentials: true,
        allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
      })
    )
    .use(
      bodyParser({
        enableTypes: ['json', 'form', 'text'],
        encoding: 'utf-8',
      })
    )
    .use(router.routes())
    .use(router.allowedMethods())

  app.proxy = true
  app.listen(appConfig.PORT)
  console.log(`${process.env.NODE_ENV}: http://localhost:${appConfig.PORT}`)
}

bootstrap().catch((error) => console.log(error))
