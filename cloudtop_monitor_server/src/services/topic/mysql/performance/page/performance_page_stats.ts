import { Op, Sequelize } from 'sequelize'
import { Log } from '../../../../../schemas'
import { StatParams } from '../../../../../types'
import { LogType } from '../../../../../types/log'
import { calculateGrowthRate } from '../../../../../utils/calculate'
import { ApiData } from '../../../../../utils/response'

const getStats = async({
  projectCode,
  projectEnv,
  startTime,
  endTime,
}: StatParams) => {
  const [data] = await Log.findAll({
    where: {
      pid: projectCode,
      env: projectEnv,
      type: LogType.PERF,
      reportTime: {
        [Op.between]: [+startTime, +endTime]
      }
    },
    attributes: [
      [Sequelize.fn('AVG', Sequelize.col('ttfb')), 'ttfb'],
      [Sequelize.fn('AVG', Sequelize.col('ready')), 'ready'],
      [Sequelize.fn('AVG', Sequelize.col('load')), 'load'],
      [Sequelize.fn('AVG', Sequelize.col('lcp')), 'lcp']
    ],
    raw: true,
  })

  return data
}

export const performancePageStats = async (params: StatParams) => {
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
      type: 'ttfb',
      value: +r1.ttfb,
      ratio: calculateGrowthRate(r1.ttfb, r2.ttfb),
    },
    {
      type: 'ready',
      value: +r1.ready,
      ratio: calculateGrowthRate(r1.ready, r2.ready),
    },
    {
      load: 'load',
      value: +r1.load,
      ratio: calculateGrowthRate(r1.load, r2.load),
    },
    {
      type: 'lcp',
      value: +r1.lcp,
      ratio: calculateGrowthRate(r1.lcp, r2.lcp),
    },
  ])
}
