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

  const records = await Log.findAll({
    where: {
      pid: projectCode,
      env: projectEnv,
      type: LogType.PERF,
      reportTime: {
        [Op.between]: [startTime.valueOf(), endTime.valueOf()]
      }
    },
    attributes: [
      'page',
      [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
      [Sequelize.fn('AVG', Sequelize.col('load')), 'load'],
    ],
    group: ['page']
  })

  return records.map((i) => ({
    page: i.page,
    count: i.dataValues.count,
    load: {
      avg: +i.dataValues.load
    },
  }))
}

export const performancePageTopList = async (params: StatParams) => {
  const data = await getData(params)
  return new ApiData(0, 'OK', data)
}
