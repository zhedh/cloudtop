import { Op, Sequelize } from 'sequelize'
import { StatParams } from '../../../../../types'
import { LogType } from '../../../../../types/log'
import { ApiData } from '../../../../../utils/response'
import { Log } from '../../../../../schemas'
import { arrayMergeByField } from '../../../../../utils/array'

const getRecords = async ({
  projectCode,
  projectEnv,
  startTime,
  endTime,
}: StatParams) => {
  const queryCondition = {
    pid: projectCode,
    env: projectEnv,
    type: LogType.RESOURCE_ERROR,
    reportTime: {
      [Op.between]: [+startTime, +endTime]
    }
  }
  const records = await Log.findAll({
    where: queryCondition,
    attributes: [
      'src',
      [Sequelize.fn('MAX', Sequelize.col('report_time')), 'reportTime'],
      [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
      [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('pv_id'))), 'pvCount'],
      [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('uid'))), 'userCount'],
    ],
    group: ['src'],
    raw: true,
    order: [
      ['count', 'DESC']
    ],
  })

  const raws = await Log.findAll({
    where: {
      ...queryCondition,
      reportTime: records.map(i => i.reportTime)
    },
    attributes: ['id', 'src', 'reportTime'],
    raw: true
  })

  return arrayMergeByField(records, raws, ['src', 'reportTime'])
}

export const errorResourceToplist = async (params: StatParams) => {
  return new ApiData(0, '数据查询成功', await getRecords(params))
}
