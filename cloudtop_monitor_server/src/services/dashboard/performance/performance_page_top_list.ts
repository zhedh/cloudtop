import { StatParams } from '../../../types'
import { LogType } from '../../../types/log'
import { ElasticBoolMust } from '../../../utils/elastic_bool'
import { ApiData } from '../../../utils/response'
import { count } from '../../elastic'

const getData = ({
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
    tops: {
      terms: {
        field: 'page.keyword',
        order: {
          'load.avg': 'desc',
        },
        size: 10,
      },
      aggs: {
        load: { stats: { field: 'load' } },
      },
    },
  }

  return count({ query, aggs })
}

export const performancePageTopList = async (params: StatParams) => {
  const { tops } = await getData(params)

  const result = tops.buckets.map((item: Record<string, any>) => {
    return {
      page: item.key,
      count: item.doc_count,
      load: item.load,
      // ready: item.ready.value,
      // load: item.load.value,
      // lcp: item.lcp.value,
    }
  })

  return new ApiData(0, 'OK', result)
}
