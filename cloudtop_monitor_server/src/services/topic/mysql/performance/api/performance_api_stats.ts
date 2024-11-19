import { Op, Sequelize } from 'sequelize'
import { Log } from '../../../../../schemas'
import { StatParams } from '../../../../../types'
import { LogType } from '../../../../../types/log'
import { calculateGrowthRate, calculateRatio } from '../../../../../utils/calculate'
import { ApiData } from '../../../../../utils/response'

const getStats = async ({
  projectCode,
  projectEnv,
  startTime,
  endTime,
}: StatParams) => {
  const [data] = await Log.findAll({
    where: {
      pid: projectCode,
      env: projectEnv,
      type: LogType.API,
      reportTime: {
        [Op.between]: [+startTime, +endTime]
      }
    },
    attributes: [
      [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
      [Sequelize.fn('AVG', Sequelize.col('time')), 'time'],
      [Sequelize.literal(`SUM(CASE WHEN success = 1 THEN 1 ELSE 0 END)`), 'successCount'],
      [Sequelize.literal(`SUM(CASE WHEN time >= 1000 THEN 1 ELSE 0 END)`), 'slowCount'],
    ],
    raw: true,
  })

  return data as Record<string, any>
}

export const performanceApiStats = async (params: StatParams) => {
  const [r1, r2] = await Promise.all([
    getStats(params),
    getStats({
      ...params,
      startTime: params.startTime.subtract(1, 'day'),
      endTime: params.endTime.subtract(1, 'day'),
    }),
  ])

  return new ApiData(0, 'OK', [
    {
      type: 'total',
      value: r1.count,
      ratio: calculateGrowthRate(r1.count, r2.count),
    },
    {
      type: 'time',
      value: +r1.time,
      ratio: calculateGrowthRate(+r1.time, +r2.time),
    },
    {
      type: 'success',
      value: calculateRatio(r1.successCount, r1.count),
      ratio:
        calculateRatio(r1.successCount, r1.count) -
        calculateRatio(r2.successCount, r2.count),
    },
    {
      type: 'slow',
      value: calculateRatio(r1.slowCount, r1.count),
      ratio:
        calculateRatio(r1.slowCount, r1.count) -
        calculateRatio(r2.slowCount, r2.count),
    },
  ])
}
