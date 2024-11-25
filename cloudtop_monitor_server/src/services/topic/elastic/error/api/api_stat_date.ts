import { count } from '../../../../../database/elastic'
import { StatParams } from '../../../../../types'
import { LogType } from '../../../../../types/log'
import { ElasticBoolMust } from '../../../../../utils/elastic_bool'
import { ApiData } from '../../../../../utils/response'

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
    .addMatch('success', 0)
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
    stats: {
      terms: {
        field: 'status',
      },
    },
  }

  return count({ query, aggs })
}

export const errorApiStatDate = async (params: StatParams) => {
  const data = await getStats(params)
  const { buckets } = data.stats

  const result = buckets.map((item: Record<string, any>) => {
    const { key, doc_count } = item
    return {
      key,
      value: doc_count,
    }
  })

  return new ApiData(0, '数据查询成功', result)
}
