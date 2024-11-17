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
    .addMatch('type', LogType.PERF)
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
    ttfb: {
      avg: {
        field: 'ttfb',
      },
    },
    ready: {
      avg: {
        field: 'ready',
      },
    },
    load: {
      avg: {
        field: 'load',
      },
    },
    lcp: {
      avg: {
        field: 'lcp',
      },
    },
  }

  return count({ query, aggs })
}

export const performancePageStat = async (params: StatParams) => {
  const { ttfb, ready, load, lcp } = await getData(params)

  return new ApiData(0, 'OK', {
    ttfb: ttfb.value,
    ready: ready.value,
    load: load.value,
    lcp: lcp.value,
  })
}
