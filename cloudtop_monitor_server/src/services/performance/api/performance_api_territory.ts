import { StatParams } from '../../../types'
import { LogType } from '../../../types/log'
import { calculateRatio } from '../../../utils/calculate'
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
    stats: {
      terms: {
        field: 'ip_region_name.keyword',
        size: 1000,
      },
      aggs: {
        success: {
          filter: {
            term: {
              success: 1, // 0=失败，1=成功
            },
          },
        },
      },
    },
  }

  return count({ query, aggs })
}

export const performanceApiTerritory = async (params: StatParams) => {
  const { stats } = await getData(params)

  const result = stats.buckets.map((i: Record<string, any>) => ({
    key: i.key,
    count: i.doc_count,
    success: i.success.doc_count,
    successRatio: calculateRatio(i.success.doc_count, i.doc_count),
  }))

  return new ApiData(0, 'OK', result)
}
