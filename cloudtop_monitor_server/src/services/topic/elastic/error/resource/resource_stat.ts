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
    .addMatch('type', LogType.RESOURCE_ERROR)
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
    count: {
      value_count: {
        field: '_id',
      },
    },
    pv: {
      cardinality: {
        field: 'pv_id.keyword',
      },
    },
    uv: {
      cardinality: {
        field: 'uid.keyword',
      },
    },
  }

  return count({ query, aggs })
}

export const errorResourceStat = async (params: StatParams) => {
  const data = await getHistogram(params)
  const { count, uv, pv } = data
  const result = { count: count.value, uv: uv.value, pv: pv.value }

  return new ApiData(0, '数据查询成功', result)
}
