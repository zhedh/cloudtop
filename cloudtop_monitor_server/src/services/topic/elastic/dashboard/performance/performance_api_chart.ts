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
    ranges: {
      range: {
        field: 'time',
        ranges: [
          { to: 1000 },
          { from: 1000, to: 5000 },
          { from: 5000, to: 10 * 1000 },
          { from: 10 * 1000, to: 30 * 1000 },
          { from: 30 * 1000 },
        ],
      },
    },
  }

  return count({ query, aggs })
}

export const performanceApiChart = async (params: StatParams) => {
  const { ranges } = await getData(params)
  const result = ranges.buckets.map((i: Record<string, any>) => ({
    key: i.key,
    value: i.doc_count,
    from: i.from,
    to: i.to,
  }))

  return new ApiData(0, 'OK', result)
}
