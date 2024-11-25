import { Op, Sequelize } from 'sequelize'
import { Log } from '../../../../../schemas'
import { StatParams } from '../../../../../types'
import { LogType } from '../../../../../types/log'
import { calculateRatio } from '../../../../../utils/calculate'
import { ApiData } from '../../../../../utils/response'

const getData = async({
  projectCode,
  projectEnv,
  startTime,
  endTime,
}: StatParams) => {

  const [data] = await Log.findAll({
    where: {
      pid: projectCode,
      env: projectEnv,
      type: LogType.API,
      reportTime: {
        [Op.between]: [+startTime, +endTime]
      }
    },
    attributes: [
      [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
      [Sequelize.fn('AVG', Sequelize.col('time')), 'time'],
      [Sequelize.literal(`SUM(CASE WHEN type = '${LogType.API}' AND success = 1 THEN 1 ELSE 0 END)`), 'success'],
    ]
  })

  const { count, time, success } = data.dataValues
  return {
    count: count,
    time: +time,
    success: +success,
    successRatio: calculateRatio(+success, count)
  }
}

export const performanceApiStat = async (params: StatParams) => {
  const result = await getData(params)
  return new ApiData(0, 'OK', result)
}
