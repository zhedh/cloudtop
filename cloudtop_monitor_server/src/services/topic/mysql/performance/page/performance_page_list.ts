import { Op, Sequelize } from 'sequelize'
import { Log } from '../../../../../schemas'
import { StatParams } from '../../../../../types'
import { LogType } from '../../../../../types/log'
import { calculateGrowthRate } from '../../../../../utils/calculate'
import { listToMap } from '../../../../../utils/converter'
import { ApiData } from '../../../../../utils/response'

interface PerformancePageListParams extends StatParams {
  page?: string
}

const getList = async ({
  projectCode,
  projectEnv,
  startTime,
  endTime,
  page,
}: PerformancePageListParams) => {

  const records = await Log.findAll({
    where: {
      pid: projectCode,
      env: projectEnv,
      type: LogType.PERF,
      page: {
        [Op.like]: `%${page}%`
      },
      reportTime: {
        [Op.between]: [+startTime, +endTime]
      }
    },
    attributes: [
      'page',
      [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
      [Sequelize.fn('AVG', Sequelize.col('ttfb')), 'ttfb'],
      [Sequelize.fn('AVG', Sequelize.col('ready')), 'ready'],
      [Sequelize.fn('AVG', Sequelize.col('load')), 'load'],
      [Sequelize.fn('AVG', Sequelize.col('lcp')), 'lcp']
    ],
    raw: true,
    limit: 1000,
    group: ['page']
  })

  return records
}

export const performancePageList = async (
  params: PerformancePageListParams
) => {
  const [r1, r2] = await Promise.all([
    getList(params),
    getList({
      ...params,
      startTime: params.startTime.subtract(1, 'day'),
      endTime: params.endTime.subtract(1, 'day'),
    }),
  ])

  const compareMap = listToMap(r2, 'page')
  const result = r1.map((item: Record<string, any>) => {
    const compare = compareMap[item.page] || {}

    return {
      page: item.page,
      count: item.count,
      ttfb: +item.ttfb,
      ttfbPrev: +compare.ttfb,
      ttfbRate: calculateGrowthRate(+item.ttfb, +compare.ttfb),
      ready: +item.ready,
      readyPrev: +compare.ready,
      readyRate: calculateGrowthRate(+item.ready, +compare.ready),
      load: +item.load,
      loadPrev: +compare.load,
      loadRate: calculateGrowthRate(+item.load, +compare.load),
      lcp: +item.lcp,
      lcpPrev: +compare.lcp,
      lcpRate: calculateGrowthRate(+item.lcp, +compare.lcp),
    }
  })
  return new ApiData(0, 'OK', result)
}
