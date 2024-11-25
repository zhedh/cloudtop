import { count } from '../../../../../database/elastic'
import { StatParams } from '../../../../../types'
import { LogType } from '../../../../../types/log'
import { calculateGrowthRate } from '../../../../../utils/calculate'
import { listToMap } from '../../../../../utils/converter'
import { ElasticBoolMust } from '../../../../../utils/elastic_bool'
import { ApiData } from '../../../../../utils/response'

interface PerformancePageListParams extends StatParams {
  page?: string
}

const getList = ({
  projectCode,
  projectEnv,
  startTime,
  endTime,
  page,
}: PerformancePageListParams) => {
  const must = new ElasticBoolMust()
    .addMatch('pid', projectCode)
    .addMatch('env', projectEnv)
    .addMatch('type', LogType.PERF)
    .addMatch('page', { query: page, fuzziness: 'auto' })
    .addRange('report_time', {
      gte: +startTime,
      lte: +endTime,
    })
  const query = {
    bool: {
      must: must.values(),
    },
  }

  const aggs = {
    list: {
      terms: {
        field: 'page.keyword',
        size: 1000,
      },
      aggs: {
        ttfb: { stats: { field: 'ttfb' } },
        ready: { stats: { field: 'ready' } },
        load: { stats: { field: 'load' } },
        lcp: { stats: { field: 'lcp' } },
      },
    },
  }

  return count({ query, aggs })
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
  // return new ApiData(0, 'OK', [r1, r2])
  const { buckets: list } = r1.list
  const { buckets: compares } = r2.list

  const compareMap = listToMap(compares, 'key')

  const result = list.map((item: Record<string, any>) => {
    const compare = compareMap[item.key] || {}

    return {
      page: item.key,
      count: item.doc_count,
      ttfb: item.ttfb.avg,
      ttfbPrev: compare.ttfb?.avg,
      ttfbRate: calculateGrowthRate(item.ttfb.avg, compare.ttfb?.avg),
      ready: item.ready.avg,
      readyPrev: compare.ready?.avg,
      readyRate: calculateGrowthRate(item.ready.avg, compare.ready?.avg),
      load: item.load.avg,
      loadPrev: compare.load?.avg,
      loadRate: calculateGrowthRate(item.load.avg, compare.load?.avg),
      lcp: item.lcp.avg,
      lcpPrev: compare.lcp?.avg,
      lcpRate: calculateGrowthRate(item.lcp.avg, compare.lcp?.avg),
    }
  })
  return new ApiData(0, 'OK', result)
}
