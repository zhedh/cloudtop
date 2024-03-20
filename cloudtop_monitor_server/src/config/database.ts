import { Dialect } from 'sequelize'

const databaseConfig = {
  host: process.env.CLOUDTOP_DATABASE_HOST!,
  port: process.env.CLOUDTOP_DATABASE_PORT!,
  user: process.env.CLOUDTOP_DATABASE_USER!,
  password: process.env.CLOUDTOP_DATABASE_PASSWORD!,
  database: process.env.CLOUDTOP_DATABASE_DATABASE!,

  dialect: 'mysql' as Dialect, // 数据库类型
  timezone: '+08:00', // 时区
}

export default databaseConfig
