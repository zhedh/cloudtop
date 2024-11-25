import { Op, Sequelize } from 'sequelize'
import { Log } from '../../../../../schemas'
import { StatParams } from '../../../../../types'
import { LogType } from '../../../../../types/log'
import { ApiData } from '../../../../../utils/response'

const getData = async ({
  projectCode,
  projectEnv,
  startTime,
  endTime,
}: StatParams) => {

  const data = await Log.findAll({
    where: {
      pid: projectCode,
      env: projectEnv,
      type: LogType.API,
      reportTime: {
        [Op.between]: [+startTime, +endTime]
      }
    },
    attributes: [
      // 使用CASE语句来根据字段time的值创建新的分组字段
      [Sequelize.literal(`CASE
        WHEN time BETWEEN 0 AND 1000 THEN '*-1000.0'
        WHEN time BETWEEN 1000 AND 5000 THEN '1000.0-5000.0'
        WHEN time BETWEEN 5000 AND 10000 THEN '5000.0-10000.0'
        WHEN time BETWEEN 10000 AND 30000 THEN '10000.0-30000.0'
        ELSE '30000+'
        END`), 'key'],
      // 计算每个范围内的记录数量
      [Sequelize.fn('COUNT', Sequelize.col('time')), 'value']
    ],
    // @ts-ignore
    group: Sequelize.literal(`CASE
        WHEN time BETWEEN 0 AND 1000 THEN '*-1000.0'
        WHEN time BETWEEN 1000 AND 5000 THEN '1000.0-5000.0'
        WHEN time BETWEEN 5000 AND 10000 THEN '5000.0-10000.0'
        WHEN time BETWEEN 10000 AND 30000 THEN '10000.0-30000.0'
        ELSE '30000+'
        END`),
  })

  return data.map(i => (i.dataValues))
}

export const performanceApiChart = async (params: StatParams) => {
  return new ApiData(0, 'OK', await getData(params))
}
