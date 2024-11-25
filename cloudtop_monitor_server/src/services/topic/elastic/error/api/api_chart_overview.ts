import { count } from '../../../../../database/elastic'
import { StatDateParams } from '../../../../../types'
import { LogType } from '../../../../../types/log'
import { calculateRatio } from '../../../../../utils/calculate'
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
    .addMatch('type', LogType.API)
    .addRange('report_time', {
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
        field: 'report_time',
        interval: 'day',
        format: 'yyyy-MM-dd',
        time_zone: '+08:00',
      },
      aggs: {
        error: {
          filter: {
            term: {
              success: 0,
            },
          },
        },
      },
    },
  }

  return count({ query, aggs })
}

export const errorApiChartOverview = async (params: StatDateParams) => {
  const data = await getIndicator(params)
  const { buckets } = data.result

  const result = buckets.map((item: Record<string, any>) => {
    const { key_as_string: key, doc_count, error } = item
    return {
      key,
      error: error.doc_count,
      errorRadio: calculateRatio(error.doc_count, doc_count),
    }
  })

  return new ApiData(0, '数据查询成功', result)
}
