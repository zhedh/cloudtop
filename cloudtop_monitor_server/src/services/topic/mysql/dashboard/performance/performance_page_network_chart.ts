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

  const data = await Log.findAll({
    where: {
      pid: projectCode,
      env: projectEnv,
      type: LogType.PV,
      reportTime: {
        [Op.between]: [startTime.valueOf(), endTime.valueOf()]
      }
    },
    attributes: [
      'ct',
      [Sequelize.fn('COUNT', Sequelize.col('ct')), 'count'],
    ],
    group: ['ct'],
  })

  return data.map(i=> ({key: i.dataValues.ct, value: i.dataValues.count}))
}

export const performancePageNetworkChart = async (params: StatParams) => {
  const result = await getData(params)
  return new ApiData(0, 'OK', result)
}
