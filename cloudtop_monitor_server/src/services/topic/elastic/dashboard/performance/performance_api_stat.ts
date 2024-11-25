import { count } from '../../../../../database/elastic'
import { StatParams } from '../../../../../types'
import { LogType } from '../../../../../types/log'
import { calculateRatio } from '../../../../../utils/calculate'
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
    count: { value_count: { field: '_id' } },
    time: {
      avg: {
        field: 'time',
      },
    },
    success: {
      filter: {
        term: {
          success: 1, // 0=失败，1=成功
        },
      },
    },
  }

  return count({ query, aggs })
}

export const performanceApiStat = async (params: StatParams) => {
  const { count, time, success } = await getData(params)

  return new ApiData(0, 'OK', {
    count: count.value,
    time: time.value,
    success: success.doc_count,
    successRatio: calculateRatio(success.doc_count, count.value),
  })
}
