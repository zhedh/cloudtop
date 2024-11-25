import { Op, Sequelize } from 'sequelize'
import { Log } from '../../../../../schemas'
import { StatParams } from '../../../../../types'
import { LogType } from '../../../../../types/log'
import { ApiData } from '../../../../../utils/response'
import { arrayGenerateOnInterval } from '../../../../../utils/array'

interface PerformanceApiDistributionParams extends StatParams {
  interval: number
}

const MAX_TIME = 10000

const getDistribution = async({
  projectCode,
  projectEnv,
  startTime,
  endTime,
  interval,
}: PerformanceApiDistributionParams) => {
  const records = await Log.findAll({
    where: {
      pid: projectCode,
      env: projectEnv,
      type: LogType.API,
      reportTime: {
        [Op.between]: [+startTime, +endTime]
      },
      time: {
        [Op.between]: [0, MAX_TIME]
      }
    },
    attributes: [
      [Sequelize.literal(`FLOOR(time / ${interval}) * ${interval}`), 'key'], // 计算分组键
      [Sequelize.fn('COUNT', Sequelize.col('id')), 'value'], // 计算每个分组的记录数
    ],

    group: ['key'],
    order: [[Sequelize.col('key'), 'ASC']], // 可选：按日期排序结果
    raw: true
  })

  return records
}

export const performanceApiDistribution = async (
  params: PerformanceApiDistributionParams
) => {
  const records = await getDistribution(params)

  const map = records.reduce((map: Record<string, Record<string, any>>, record: Record<string, any>) => {
    const key = record.key

    map[key] = record.value
    return map
  }, {})

  const list = arrayGenerateOnInterval(0, MAX_TIME, params.interval).map(key => {
    return  {
      key: key,
      value: map[key] || 0,
    }
  })

  return new ApiData(0, 'OK', list)
}
