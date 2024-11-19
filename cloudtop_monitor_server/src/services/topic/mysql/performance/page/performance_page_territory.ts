import { Op, Sequelize } from 'sequelize'
import { Log } from '../../../../../schemas'
import { StatParams } from '../../../../../types'
import { LogType } from '../../../../../types/log'
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
      type: LogType.PERF,
      reportTime: {
        [Op.between]: [+startTime, +endTime]
      }
    },
    attributes: [
      'ipRegionName',
      [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
      // [Sequelize.fn('AVG', Sequelize.col('ttfb')), 'ttfb'],
      // [Sequelize.fn('AVG', Sequelize.col('ready')), 'ready'],
      [Sequelize.fn('AVG', Sequelize.col('load')), 'load'],
      // [Sequelize.fn('AVG', Sequelize.col('lcp')), 'lcp']
    ],
    raw: true,
    limit: 1000,
    group: ['ipRegionName']
  })

  return records
}

export const performancePageTerritory = async (params: StatParams) => {
  const records = await getData(params)

  const result = records.map((i: Record<string, any>) => ({
    key: i.ipRegionName || '未知',
    count: +i.count,
    load: +i.load,
  }))

  return new ApiData(0, 'OK', result)
}
