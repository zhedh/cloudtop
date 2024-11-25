import { Sequelize } from 'sequelize'
import config from '../../config/database'

export const sequelize = new Sequelize(config.database, config.user, config.password, {
  host: config.host,
  port: +config.port,
  dialect: config.dialect!,
  timezone: config.timezone,
})
