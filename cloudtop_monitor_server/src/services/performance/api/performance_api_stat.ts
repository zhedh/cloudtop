import { count } from '../../../database/elastic'
import { StatParams } from '../../../types'
import { LogType } from '../../../types/log'
import { calculateGrowthRate, calculateRatio } from '../../../utils/calculate'
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
    .addMatch('type', LogType.API)
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
    time: {
      avg: {
        field: 'time',
      },
    },
    success: {
      filter: {
        term: {
          success: 1, // 0=失败，1=成功
        },
      },
    },
    slow: {
      filter: {
        range: {
          time: {
            gte: 1000,
            // lte: '2020-11-14 23:59:59',
          },
        },
      },
    },
  }

  return count({ query, aggs })
}

export const performanceApiStat = async (params: StatParams) => {
  const [r1, r2] = await Promise.all([
    getStats(params),
    getStats({
      ...params,
      startTime: params.startTime.subtract(1, 'day'),
      endTime: params.endTime.subtract(1, 'day'),
    }),
  ])
  // return new ApiData(0, 'OK', [r1, r2])

  return new ApiData(0, 'OK', [
    {
      type: 'total',
      value: r1.total,
      ratio: calculateGrowthRate(r1.total, r2.total),
    },
    {
      type: 'time',
      value: r1.time.value,
      ratio: calculateGrowthRate(r1.time.value, r2.time.value),
    },
    {
      load: 'success',
      value: calculateRatio(r1.success.doc_count, r1.total),
      ratio:
        calculateRatio(r1.success.doc_count, r1.total) -
        calculateRatio(r2.success.doc_count, r2.total),
    },
    {
      type: 'slow',
      value: calculateRatio(r1.slow.doc_count, r1.total),
      ratio:
        calculateRatio(r1.slow.doc_count, r1.total) -
        calculateRatio(r2.slow.doc_count, r2.total),
    },
  ])
}
