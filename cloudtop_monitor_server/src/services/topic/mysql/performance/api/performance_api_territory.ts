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

  const records = await Log.findAll({
    where: {
      pid: projectCode,
      env: projectEnv,
      type: LogType.API,
      reportTime: {
        [Op.between]: [+startTime, +endTime]
      }
    },
    attributes: [
      'ipRegionName',
      [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
      [Sequelize.literal(`SUM(CASE WHEN success = 1 THEN 1 ELSE 0 END)`), 'successCount'],
    ],
    raw: true,
    limit: 1000,
    group: ['ipRegionName']
  })

  return records
}

export const performanceApiTerritory = async (params: StatParams) => {
  const records = await getData(params)

  const result = records.map((i: Record<string, any>) => ({
    key: i.ipRegionName || '未知',
    count: i.count,
    success: +i.successCount,
    successRatio: calculateRatio(+i.successCount, i.count),
  }))

  return new ApiData(0, 'OK', result)
}
