import { count } from '../../../../../database/elastic'
import { StatParams } from '../../../../../types'
import { LogType } from '../../../../../types/log'
import { ElasticBoolMust } from '../../../../../utils/elastic_bool'
import { ApiData } from '../../../../../utils/response'

interface PerformanceApiDistributionParams extends StatParams {
  interval: number
}

const getDistribution = ({
  projectCode,
  projectEnv,
  startTime,
  endTime,
  interval,
}: PerformanceApiDistributionParams) => {
  const must = new ElasticBoolMust()
    .addMatch('pid', projectCode)
    .addMatch('env', projectEnv)
    .addMatch('type', LogType.API)
    .addRange('date', {
      gte: +startTime,
      lte: +endTime,
    })
    .addRange('time', {
      gte: 0,
      lte: 10000,
    })

  const query = {
    bool: {
      must: must.values(),
    },
  }

  const aggs = {
    data: {
      histogram: {
        field: 'time',
        interval: interval,
      },
    },
  }

  return count({ query, aggs })
}

export const performanceApiDistribution = async (
  params: PerformanceApiDistributionParams
) => {
  const { data } = await getDistribution(params)

  const records = data.buckets.map((i: Record<string, any>) => ({
    key: i.key,
    value: i.doc_count,
  }))

  return new ApiData(0, 'OK', records)
}
