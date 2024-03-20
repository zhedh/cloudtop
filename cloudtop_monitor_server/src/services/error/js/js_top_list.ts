import { search } from '../../elastic'
import { ApiData } from '../../../utils/response'
import { LogType } from '../../../types/log'
import { StatParams } from '../../../types'
import { ElasticBoolMust } from '../../../utils/elastic_bool'

const getRecords = ({
  projectCode,
  projectEnv,
  startTime,
  endTime,
}: StatParams) => {
  const must = new ElasticBoolMust()
    .addMatch('pid', projectCode)
    .addMatch('env', projectEnv)
    .addMatch('type', LogType.ERROR)
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
    group: {
      terms: {
        field: 'msg.keyword',
      },
      aggs: {
        userCount: {
          cardinality: {
            field: 'uid.keyword',
          },
        },
      },
    },
  }

  const collapse = {
    field: 'msg.keyword',
  }

  const sort = [
    {
      date: {
        order: 'desc',
      },
    },
  ]

  return search({ query, aggs, collapse, sort })
}

export const errorJsToplist = async (params: StatParams) => {
  const { records = [], aggregations } = await getRecords(params)
  const { buckets = [] } = aggregations.group

  const map = buckets.reduce(
    (map: Record<string, any>, cur: Record<string, any>) => {
      const count = cur.doc_count
      const userCount = cur.userCount.value

      map[cur.key] = {
        count,
        userCount,
      }
      return map
    },
    {} as Record<string, any>
  )

  const result = records.map((r: Record<string, any>) => ({
    id: r.id,
    category: r.category,
    msg: r.msg,
    reportTime: r.reportTime,
    ...(map[r.msg] ?? {}),
  }))

  return new ApiData(0, '数据查询成功', result)
}
