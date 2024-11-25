import { ApiData } from '../../../../../utils/response'
import { LogType } from '../../../../../types/log'
import { calculateRatio, calculateScore } from '../../../../../utils/calculate'
import { StatParams } from '../../../../../types'
import { ElasticBoolMust } from '../../../../../utils/elastic_bool'
import { count } from '../../../../../database/elastic'

const getData = ({
  projectCode,
  projectEnv,
  startTime,
  endTime,
}: StatParams) => {
  const must = new ElasticBoolMust()
    .addMatch('pid', projectCode)
    .addMatch('env', projectEnv)
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
    pv: {
      cardinality: {
        field: 'pv_id.keyword',
      },
    },
    error: {
      filter: {
        term: {
          type: LogType.ERROR,
        },
      },
      aggs: {
        pv_error: {
          cardinality: {
            field: 'pv_id.keyword',
          },
        },
      },
    },
    resource_error: {
      filter: {
        term: {
          type: LogType.RESOURCE_ERROR,
        },
      },
      aggs: {
        pv_resource_error: {
          cardinality: {
            field: 'pv_id.keyword',
          },
        },
      },
    },
    api: {
      filter: {
        term: {
          type: LogType.API,
        },
      },
      aggs: {
        api_error: {
          filter: {
            term: {
              success: 0, // 0=失败，1=成功
            },
          },
        },
      },
    },
  }

  return count({ query, aggs })
}

export const healthScore = async (data: StatParams) => {
  const { pv, error, resource_error, api } = await getData(data)

  const errorRatio = calculateRatio(error.pv_error.value, pv.value)
  const resourceErrorRatio = calculateRatio(
    resource_error.pv_resource_error.value,
    pv.value
  )
  const apiErrorRatio = calculateRatio(api.api_error.doc_count, api.doc_count)

  const scoreNumerator =
    calculateScore(errorRatio) * 3 +
    calculateScore(resourceErrorRatio) * 2 +
    calculateScore(apiErrorRatio) * 3

  const result = {
    score: calculateRatio(scoreNumerator, 8),
    records: [
      {
        type: 'error',
        count: error.doc_count,
        ratio: errorRatio,
      },
      {
        type: 'resource_error',
        count: resource_error.doc_count,
        ratio: resourceErrorRatio,
      },
      {
        type: 'api_error',
        count: api.doc_count,
        ratio: apiErrorRatio,
      },
    ],
  }

  return new ApiData(0, 'OK', result)
}
