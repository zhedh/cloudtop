import { Op, Sequelize } from 'sequelize'
import { StatDateParams } from '../../../../../types'
import { LogType } from '../../../../../types/log'
import { calculateRatio } from '../../../../../utils/calculate'
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
    type: LogType.API,
    reportTime: {
      [Op.between]: [+startDate.startOf('date'), +endDate.endOf('date')]
    }
  }

  const records = await Log.findAll({
    where: queryCondition,
    attributes: [
      [Sequelize.fn('DATE', Sequelize.col('report_time')), 'key'], // 使用 DATE 函数将时间转换为日期，以便分组
      [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
      [Sequelize.literal(`SUM(CASE WHEN success = 0 THEN 1 ELSE 0 END)`), 'errorCount'],
    ],

    group: ['key'], // 按日期分组
    order: [[Sequelize.col('key'), 'ASC']], // 可选：按日期排序结果
    raw: true
  })

  return records
}

export const errorApiChartOverview = async (params: StatDateParams) => {
  const data = await getIndicator(params)

  const result = data.map((item: Record<string, any>) => {
    return {
      key: item.key,
      error: +item.errorCount,
      errorRadio: calculateRatio(+item.errorCount, item.count),
    }
  })

  return new ApiData(0, '数据查询成功', result)
}
