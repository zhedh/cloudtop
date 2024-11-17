import { Dayjs } from 'dayjs'
import { LogType } from '../../../../../types/log'
import { search } from '../../../../../database/elastic'
import { ApiData } from '../../../../../utils/response'

export interface ErrorApiTopListParams {
  projectCode: string
  projectEnv: string
  startTime: Dayjs
  endTime: Dayjs
  sort?: string
  order?: 'desc' | 'asc'
}

const getRecords = ({
  projectCode,
  projectEnv,
  startTime,
  endTime,
}: ErrorApiTopListParams) => {
  const query = {
    bool: {
      must: [
        {
          match: { pid: projectCode },
        },
        {
          match: { env: projectEnv },
        },
        {
          match: { type: LogType.API },
        },
        {
          match: { success: 0 },
        },
        {
          range: {
            date: {
              gte: +startTime,
              lte: +endTime,
            },
          },
        },
      ],
    },
  }

  const aggs = {
    stats: {
      terms: {
        script: {
          source: "doc['api.keyword'].value + '-' + doc['status'].value",
          lang: 'painless',
        },
        size: 10,
      },
      aggs: {
        uv: {
          cardinality: {
            field: 'uid.keyword',
          },
        },
        min_time: {
          min: {
            field: 'date',
          },
        },
        max_time: {
          max: {
            field: 'date',
          },
        },
        docs: {
          top_hits: {
            sort: [{ date: { order: 'desc' } }],
            size: 100,
            _source: ['api', 'status', 'report_time', 'date', 'src', 'uid'],
          },
        },
      },
    },
  }

  return search({ query, aggs })
}

export const errorApiTopList = async (params: ErrorApiTopListParams) => {
  const { sort = 'date', order = 'desc' } = params
  const { aggregations } = await getRecords(params)
  const { buckets = [] } = aggregations.stats

  const list = buckets.map((b: Record<string, any>) => {
    const { hits } = b.docs.hits
    const records = hits.map((r: Record<string, any>) => ({
      id: r._id,
      date: r._source.date,
      report_time: r._source.report_time,
      api: r._source.api,
      src: r._source.src,
      status: r._source.status,
      uid: r._source.uid,
    }))

    return {
      key: b.key,
      id: records[0].id,
      status: records[0].status,
      api: records[0].api,
      count: b.doc_count,
      userCount: b.uv.value,
      timeRange: [b.min_time.value, b.max_time.value],
      records,
    }
  })

  const result = list.sort((a: Record<string, any>, b: Record<string, any>) =>
    order === 'desc' ? b[sort] - a[sort] : a[sort] - b[sort]
  )

  return new ApiData(0, '数据查询成功', result)
}
