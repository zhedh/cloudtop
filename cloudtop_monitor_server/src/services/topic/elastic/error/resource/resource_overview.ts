import { count } from '../../../../../database/elastic'
import { StatDateParams } from '../../../../../types'
import { LogType } from '../../../../../types/log'
import { ElasticBoolMust } from '../../../../../utils/elastic_bool'
import { ApiData } from '../../../../../utils/response'

const getIndicator = ({
  projectCode,
  projectEnv,
  startDate,
  endDate,
}: StatDateParams) => {
  const must = new ElasticBoolMust()
    .addMatch('pid', projectCode)
    .addMatch('env', projectEnv)
    .addMatch('type', LogType.RESOURCE_ERROR)
    .addRange('date', {
      gte: +startDate.startOf('date'),
      lte: +endDate.endOf('date'),
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
        interval: 'day',
        format: 'yyyy-MM-dd',
        time_zone: '+08:00',
      },
    },
  }

  return count({ query, aggs })
}

export const errorResourceOverview = async (params: StatDateParams) => {
  const data = await getIndicator(params)
  const { buckets } = data.result
  const result = buckets.map((b: Record<string, any>) => ({
    key: b.key_as_string,
    value: b.doc_count,
  }))

  return new ApiData(0, '数据查询成功', result)
}
