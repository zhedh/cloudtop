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
      type: LogType.API,
      reportTime: {
        [Op.between]: [+startTime, +endTime]
      }
    },
    attributes: [
      'api',
      [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
      [Sequelize.fn('AVG', Sequelize.col('time')), 'time'],
    ],
    group: ['api'],
    order: [['time', 'DESC']]
  })

  return records.map((i) => ({
    api: i.api,
    count: i.dataValues.count,
    time: {
      avg: +i.dataValues.time || 0
    },
  }))
}

export const performanceApiTopList = async (params: StatParams) => {
  const result = await getData(params)

  // const result = tops.buckets.map((item: Record<string, any>) => {
  //   return {
  //     api: item.key,
  //     count: item.doc_count,
  //     time: item.time,
  //   }
  // })

  return new ApiData(0, 'OK', result)
}
