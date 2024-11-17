import { count } from '../../../database/elastic'
import { StatParams } from '../../../types'
import { LogType } from '../../../types/log'
import { calculateGrowthRate } from '../../../utils/calculate'
import { ElasticBoolMust } from '../../../utils/elastic_bool'
import { ApiData } from '../../../utils/response'

const getStats = ({
  projectCode,
  projectEnv,
  startTime,
  endTime,
}: StatParams) => {
  const must = new ElasticBoolMust()
    .addMatch('pid', projectCode)
    .addMatch('env', projectEnv)
    .addMatch('type', LogType.PERF)
    .addRange('date', {
      gte: +startTime,
      lte: +endTime,
    })
  const query = {
    bool: {
      must: must.values(),
    },
  }

  const aggs = {
    ttfb: {
      avg: {
        field: 'ttfb',
      },
    },
    ready: {
      avg: {
        field: 'ready',
      },
    },
    load: {
      avg: {
        field: 'load',
      },
    },
    lcp: {
      avg: {
        field: 'lcp',
      },
    },
  }

  return count({ query, aggs })
}

export const performancePageStat = async (params: StatParams) => {
  const [r1, r2] = await Promise.all([
    getStats(params),
    getStats({
      ...params,
      startTime: params.startTime.subtract(1, 'day'),
      endTime: params.endTime.subtract(1, 'day'),
    }),
  ])
  // return new ApiData(0, 'OK', [r1, r2])
  // const { ttfb, ready, load, lcp } = await getStats(params)

  return new ApiData(0, 'OK', [
    {
      type: 'ttfb',
      value: r1.ttfb.value,
      ratio: calculateGrowthRate(r1.ttfb.value, r2.ttfb.value),
    },
    {
      type: 'ready',
      value: r1.ready.value,
      ratio: calculateGrowthRate(r1.ready.value, r2.ready.value),
    },
    {
      load: 'load',
      value: r1.load.value,
      ratio: calculateGrowthRate(r1.load.value, r2.load.value),
    },
    {
      type: 'lcp',
      value: r1.lcp.value,
      ratio: calculateGrowthRate(r1.lcp.value, r2.lcp.value),
    },
  ])
}
