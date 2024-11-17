import { count } from '../../../database/elastic'
import { StatParams } from '../../../types'
import { LogType } from '../../../types/log'
import { ElasticBoolMust } from '../../../utils/elastic_bool'
import { ApiData } from '../../../utils/response'

interface PerformanceApiTerminalParams extends StatParams {
  terminalType: string
}

const getData = ({
  projectCode,
  projectEnv,
  startTime,
  endTime,
  terminalType,
}: PerformanceApiTerminalParams) => {
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
    list: {
      terms: {
        field: `${terminalType}.keyword`,
        size: 1000,
        // order: {
        //   'load.avg': 'desc',
        // },
      },
      aggs: {
        times: {
          range: {
            field: 'time',
            ranges: [
              { from: 0, to: 1000 },
              { from: 1000, to: 5000 },
              { from: 5000, to: 10 * 1000 },
              { from: 10 * 1000, to: 30 * 1000 },
              { from: 30 * 1000 },
            ],
          },
        },
      },
    },
  }

  return count({ query, aggs })
}

export const performanceApiTerminal = async (
  params: PerformanceApiTerminalParams
) => {
  const { list } = await getData(params)
  const records = list.buckets.map((i: Record<string, any>) => {
    return {
      key: i.key,
      count: i.doc_count,
      times: i.times.buckets.map((i: Record<string, any>) => ({
        ...i,
        count: i.doc_count,
      })),
    }
  })

  return new ApiData(0, 'OK', records)
}
