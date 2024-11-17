import { Op, Sequelize } from 'sequelize'
import { Log } from '../../../../../schemas'
import { StatParams } from '../../../../../types'
import { LogType } from '../../../../../types/log'
import { ApiData } from '../../../../../utils/response'
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
    type: LogType.ERROR,
    reportTime: {
      [Op.between]: [+startTime, +endTime]
    }
  }
  const records = await Log.findAll({
    where: queryCondition,
    attributes: [
      'msg',
      [Sequelize.fn('MAX', Sequelize.col('report_time')), 'reportTime'],
      [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
      [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('uid'))), 'userCount'],
    ],
    group: ['msg'],
    raw: true,
    order: [
      ['count', 'DESC']
      // [Sequelize.literal('MAX("report_time")'), 'DESC']
    ],
  })

  const raws = await Log.findAll({
    where: {
      ...queryCondition,
      reportTime: records.map(i => i.reportTime)
    },
    attributes: ['id', 'category', 'msg', 'reportTime'],
    raw: true
  })

  return arrayMergeByField(records, raws, ['msg', 'reportTime'])
}

export const errorJsToplist = async (params: StatParams) => {
  const records = await getRecords(params)
  // const result = records.map((r: Record<string, any>) => ({
  //   id: r.id,
  //   category: r.category,
  //   msg: r.msg,
  //   reportTime: r.reportTime,
  //   count: r.count,
  //   userCount: r.userCount
  // }))

  return new ApiData(0, '数据查询成功', records)
}
