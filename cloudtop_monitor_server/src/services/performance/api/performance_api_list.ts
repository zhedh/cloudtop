import dayjs from 'dayjs'
import { StatParams } from '../../../types'
import { LogType } from '../../../types/log'
import { calculateRatio } from '../../../utils/calculate'
import { ElasticBoolMust } from '../../../utils/elastic_bool'
import { ApiData } from '../../../utils/response'
import { count } from '../../../database/elastic'

interface PerformanceApiListParams extends StatParams {
  api?: string
}

const getHitsSource = (docs: Record<string, any>) => {
  const { hits } = docs.hits

  return hits.map((i: Record<string, any>) => ({ _id: i._id, ...i._source }))
}

const getList = ({
  projectCode,
  projectEnv,
  startTime,
  endTime,
  api,
}: PerformanceApiListParams) => {
  const must = new ElasticBoolMust()
    .addMatch('pid', projectCode)
    .addMatch('env', projectEnv)
    .addMatch('type', LogType.API)
    .addMatch('api', { query: api, fuzziness: 'auto' })
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
        field: 'api.keyword',
        size: 1000,
        order: {
          time: 'desc',
        },
      },
      aggs: {
        time: {
          avg: {
            field: 'time',
          },
        },
        error: {
          filter: {
            term: {
              success: 0, // 0=失败，1=成功
            },
          },
          aggs: {
            uv: {
              cardinality: {
                field: 'uid.keyword',
              },
            },
          },
        },
        slow: {
          filter: {
            range: {
              time: {
                gte: 1000,
                // lte: '2020-11-14 23:59:59',
              },
            },
          },
        },

        docs: {
          top_hits: {
            sort: [{ date: { order: 'desc' } }],
            size: 1,
            _source: ['src', 'date', 'api'],
          },
        },
      },
    },
  }

  return count({ query, aggs })
}

export const performanceApiList = async (params: PerformanceApiListParams) => {
  const { list } = await getList(params)

  const records = list.buckets.map((i: Record<string, any>) => {
    const successCount = i.doc_count - i.error.doc_count
    const source = getHitsSource(i.docs)

    const [first] = source || []
    const reg = /^https?:\/\/[^\?\#\/]*/
    const [origin, date] = reg.exec(first?.src || '') || []

    return {
      api: i.key,
      count: i.doc_count,
      time: i.time.value,
      successCount: successCount,
      successRatio: calculateRatio(successCount, i.doc_count),
      slowCount: i.slow.doc_count,
      slowRatio: calculateRatio(i.slow.doc_count, i.doc_count),
      errorCount: i.error.doc_count,
      errorUserCount: i.error.uv.value,
      origin: origin,
      date: dayjs(date).format('YYYY-MM-DD HH:mm:ss'),
      source,
    }
  })

  return new ApiData(0, 'OK', records)
}
