import { Op, Sequelize } from 'sequelize'
import { StatParams } from '../../../../../types'
import { LogType } from '../../../../../types/log'
import { ApiData } from '../../../../../utils/response'
import { Log } from '../../../../../schemas'

const getStats = async({
  projectCode,
  projectEnv,
  startTime,
  endTime,
}: StatParams) => {
  const queryCondition = {
    pid: projectCode,
    env: projectEnv,
    type: LogType.API,
    success: 0,
    reportTime: {
      [Op.between]: [+startTime, +endTime]
    }
  }

  const records = await Log.findAll({
    where: queryCondition,
    attributes: [
      'status',
      [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
    ],

    group: ['status'], // 按日期分组
    raw: true
  })

  return records
}

export const errorApiStatDate = async (params: StatParams) => {
  const data = await getStats(params)

  const result = data.map((item: Record<string, any>) => {
    return {
      key: item.status,
      value: item.count,
    }
  })

  return new ApiData(0, '数据查询成功', result)
}
