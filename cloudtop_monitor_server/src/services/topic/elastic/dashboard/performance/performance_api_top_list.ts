import { count } from '../../../../../database/elastic'
import { StatParams } from '../../../../../types'
import { LogType } from '../../../../../types/log'
import { ElasticBoolMust } from '../../../../../utils/elastic_bool'
import { ApiData } from '../../../../../utils/response'

const getData = ({
  projectCode,
  projectEnv,
  startTime,
  endTime,
}: StatParams) => {
  const must = new ElasticBoolMust()
    .addMatch('pid', projectCode)
    .addMatch('env', projectEnv)
    .addMatch('type', LogType.API)
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
    tops: {
      terms: {
        field: 'api.keyword',
        order: {
          'time.avg': 'desc',
        },
        size: 10,
      },
      aggs: {
        time: { stats: { field: 'time' } },
      },
    },
  }

  return count({ query, aggs })
}

export const performanceApiTopList = async (params: StatParams) => {
  const { tops } = await getData(params)

  const result = tops.buckets.map((item: Record<string, any>) => {
    return {
      api: item.key,
      count: item.doc_count,
      time: item.time,
    }
  })

  return new ApiData(0, 'OK', result)
}
