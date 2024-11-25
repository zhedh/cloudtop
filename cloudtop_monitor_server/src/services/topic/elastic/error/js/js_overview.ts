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
      },
    },
  }

  return count({ query, aggs })
}

export const errorJsOverview = async (params: StatDateParams) => {
  const data = await getIndicator(params)
  const { buckets } = data.result

  const result = buckets.map((item: Record<string, any>) => {
    const { key_as_string: key, pv, error } = item
    const pvError = error.pv_error.value
    return {
      key,
      error: error.doc_count,
      errorRadio: Number((pvError / pv.value).toFixed(4)),
    }
  })

  return new ApiData(0, '数据查询成功', result)
}
