import { Op, Sequelize } from 'sequelize'
import { Log } from '../../../../../schemas'
import { StatParams } from '../../../../../types'
import { LogType } from '../../../../../types/log'
import { ApiData } from '../../../../../utils/response'

const getHistogram = async({
  projectCode,
  projectEnv,
  startTime,
  endTime,
}: StatParams) => {
  const [data] = await Log.findAll({
    where: {
      pid: projectCode,
      env: projectEnv,
      type: LogType.RESOURCE_ERROR,
      reportTime: {
        [Op.between]: [+startTime, +endTime]
      }
    },
    attributes: [
      [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
      [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('pv_id'))), 'pv'],
      [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('uid'))), 'uv'],
    ],
    raw: true
  })

  return data
}

export const errorResourceStat = async (params: StatParams) => {
  return new ApiData(0, '数据查询成功', await getHistogram(params))
}
