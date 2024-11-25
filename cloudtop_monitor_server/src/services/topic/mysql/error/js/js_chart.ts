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
  const records = await Log.findAll({
    where: {
      pid: projectCode,
      env: projectEnv,
      type: LogType.ERROR,
      reportTime: {
        [Op.between]: [+startTime, +endTime]
      }
    },
    attributes: [
      [Sequelize.fn('DATE_FORMAT', Sequelize.col('report_time'), '%Y-%m-%d %H:00:00'), 'key'],
      [Sequelize.fn('COUNT', Sequelize.col('id')), 'value'], // 使用 DATE 函数将时间转换为日期，以便分组
    ],

    group: ['key'], // 按日期分组
    order: [[Sequelize.col('key'), 'ASC']], // 可选：按日期排序结果
    raw: true
  })

  return records
}

export const errorJsChart = async (params: StatParams) => {
  const data = await getHistogram(params)

  return new ApiData(
    0,
    '数据查询成功',
    data.map((b: Record<string, any>) => ({
      key: b.key,
      value: +b.value,
    }))
  )
}
