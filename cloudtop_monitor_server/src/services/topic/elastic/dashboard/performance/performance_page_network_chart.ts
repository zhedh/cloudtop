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
    .addMatch('type', LogType.PV)
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
    network: {
      terms: {
        field: 'ct.keyword',
      },
    },
  }

  return count({ query, aggs })
}

export const performancePageNetworkChart = async (params: StatParams) => {
  const { network } = await getData(params)
  const result = network.buckets.map((i: Record<string, any>) => ({
    key: i.key,
    value: i.doc_count,
  }))

  return new ApiData(0, 'OK', result)
}
