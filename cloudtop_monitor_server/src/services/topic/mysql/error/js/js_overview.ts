import { Op, Sequelize } from 'sequelize'
import { Log } from '../../../../../schemas'
import { StatDateParams } from '../../../../../types'
import { LogType } from '../../../../../types/log'
import { ApiData } from '../../../../../utils/response'

const getIndicator = async({
  projectCode,
  projectEnv,
  startDate,
  endDate,
}: StatDateParams) => {
  const queryCondition = {
    pid: projectCode,
    env: projectEnv,
    reportTime: {
      [Op.between]: [+startDate.startOf('date'), +endDate.endOf('date')]
    }
  }

 const records = await Log.findAll({
    where: queryCondition,
    attributes: [
      [Sequelize.fn('DATE', Sequelize.col('report_time')), 'reportTime'], // 使用 DATE 函数将时间转换为日期，以便分组
      [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('pv_id'))), 'pv'],
      [Sequelize.literal(`SUM(CASE WHEN type = '${LogType.ERROR}' THEN 1 ELSE 0 END)`), 'error'],
    ],
    
    group: ['reportTime'], // 按日期分组
    order: [[Sequelize.col('reportTime'), 'ASC']], // 可选：按日期排序结果
    raw: true
  })

  return records
}

export const errorJsOverview = async (params: StatDateParams) => {
  const data = await getIndicator(params)
  const result = data.map((item: Record<string, any>) => {
    return {
      key: item.reportTime,
      error: +item.error,
      errorRadio: Number((+item.error / +item.pv).toFixed(4)),
    }
  })

  return new ApiData(0, '数据查询成功', result)
}
