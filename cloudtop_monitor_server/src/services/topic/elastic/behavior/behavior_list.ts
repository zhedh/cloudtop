import { search } from '../../../../database/elastic'
import { PaginationParams, StatParams } from '../../../../types'
import { ElasticBoolMust } from '../../../../utils/elastic_bool'
import { ApiData } from '../../../../utils/response'

interface BehaviorQueryData extends StatParams, PaginationParams {
  keyword?: string
}

const getLogs = async (data: BehaviorQueryData) => {
  console.log('data.keyword:::: ', data.keyword)
  const { pageSize = 20, current = 1 } = data
  const must = new ElasticBoolMust()
    .addMatch('pid', data.projectCode)
    .addMatch('env', data.projectEnv)
    .addRange('report_time', {
      gte: +data.startTime,
      lte: +data.endTime,
    })

  const query = {
    bool: {
      must: must.values(),
      should: [
        {
          match: {
            uid: data.keyword || ''
          }
        },
        {
          match: {
            loginId: data.keyword || ''
          }
        }
      ],
    },
  }

  const aggs = {
    count: {
      cardinality: {
        field: 'uid.keyword',
      },
    },
  }

  const collapse = {
    field: 'uid.keyword',
  }

  const sort = [
    {
      report_time: {
        order: 'desc',
      },
    },
  ]

  return search(
    { query, aggs, collapse, sort },
    pageSize,
    (current - 1) * pageSize
  )
}

export const behaviorList = async (data: BehaviorQueryData) => {
  console.log('data::: ', data)
  const { aggregations, records } = await getLogs(data)
  const { value } = aggregations.count ?? {}

  console.log('aggregations::: ', aggregations)

  return new ApiData(0, '查询项目列表成功', {
    records,
    pagination: {
      current: data.current,
      pageSize: data.pageSize,
      total: value,
    },
  })
}
