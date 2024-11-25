import { search } from '../../../../../database/elastic'
import { StatParams } from '../../../../../types'
import { LogType } from '../../../../../types/log'
import { ElasticBoolMust } from '../../../../../utils/elastic_bool'
import { ApiData } from '../../../../../utils/response'

const getRecords = ({
  projectCode,
  projectEnv,
  startTime,
  endTime,
}: StatParams) => {
  const must = new ElasticBoolMust()
    .addMatch('pid', projectCode)
    .addMatch('env', projectEnv)
    .addMatch('type', LogType.RESOURCE_ERROR)
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
    group: {
      terms: {
        field: 'src.keyword',
      },
      aggs: {
        count: {
          value_count: {
            field: '_id',
          },
        },
        pvCount: {
          cardinality: {
            field: 'pv_id.keyword',
          },
        },
        userCount: {
          cardinality: {
            field: 'uid.keyword',
          },
        },
      },
    },
  }

  const collapse = {
    field: 'src.keyword',
  }

  const sort = [
    {
      report_time: {
        order: 'desc',
      },
    },
  ]

  return search({ query, aggs, collapse, sort })
}

export const errorResourceToplist = async (params: StatParams) => {
  const { records = [], aggregations } = await getRecords(params)
  const { buckets = [] } = aggregations.group

  const map = buckets.reduce(
    (map: Record<string, any>, cur: Record<string, any>) => {
      const count = cur.count.value
      const pvCount = cur.pvCount.value
      const userCount = cur.userCount.value

      map[cur.key] = {
        count,
        pvCount,
        userCount,
      }
      return map
    },
    {} as Record<string, any>
  )

  const result = records.map((r: Record<string, any>) => ({
    id: r.id,
    src: r.src,
    reportTime: r.reportTime,
    ...(map[r.src] ?? {}),
  }))

  return new ApiData(0, '数据查询成功', result)
}
