import { count } from '../../../../../database/elastic'
import { StatParams } from '../../../../../types'
import { LogType } from '../../../../../types/log'
import { ElasticBoolMust } from '../../../../../utils/elastic_bool'
import { ApiData } from '../../../../../utils/response'


const getHistogram = ({
  projectCode,
  projectEnv,
  startTime,
  endTime,
}: StatParams) => {
  const must = new ElasticBoolMust()
    .addMatch('pid', projectCode)
    .addMatch('env', projectEnv)
    .addMatch('type', LogType.ERROR)
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
    result: {
      date_histogram: {
        field: 'date',
        interval: '120m',
        format: 'yyyy-MM-dd HH',
        time_zone: '+08:00',
      },
    },
  }

  return count({ query, aggs })
}

export const errorJsChart = async (params: StatParams) => {
  const data = await getHistogram(params)
  const { buckets } = data.result

  return new ApiData(
    0,
    '数据查询成功',
    buckets.map((b: Record<string, any>) => ({
      key: b.key_as_string,
      value: b.doc_count,
    }))
  )
}
