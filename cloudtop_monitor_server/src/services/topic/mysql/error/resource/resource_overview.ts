import { Op, Sequelize } from 'sequelize'
import { StatDateParams } from '../../../../../types'
import { LogType } from '../../../../../types/log'
import { ApiData } from '../../../../../utils/response'
import { Log } from '../../../../../schemas'

const getIndicator = async({
  projectCode,
  projectEnv,
  startDate,
  endDate,
}: StatDateParams) => {
  const queryCondition = {
    pid: projectCode,
    env: projectEnv,
    type: LogType.RESOURCE_ERROR,
    reportTime: {
      [Op.between]: [+startDate.startOf('date'), +endDate.endOf('date')]
    }
  }

  const records = await Log.findAll({
    where: queryCondition,
    attributes: [
      [Sequelize.fn('DATE', Sequelize.col('report_time')), 'key'], // 使用 DATE 函数将时间转换为日期，以便分组
      [Sequelize.fn('COUNT', Sequelize.col('id')), 'value'],
    ],

    group: ['key'], // 按日期分组
    order: [[Sequelize.col('key'), 'ASC']], // 可选：按日期排序结果
    raw: true
  })

  return records
}

export const errorResourceOverview = async (params: StatDateParams) => {
  return new ApiData(0, '数据查询成功', await getIndicator(params))
}
