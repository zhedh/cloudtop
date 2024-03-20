import { ApiData } from '../../utils/response'
import { PaginationParams, StatParams } from '../../types'
import { search } from '../elastic'
import { ElasticBoolMust } from '../../utils/elastic_bool'

interface BehaviorQueryData extends StatParams, PaginationParams {}

const getLogs = async (data: BehaviorQueryData) => {
  const { pageSize = 20, current = 1 } = data
  const must = new ElasticBoolMust()
    .addMatch('pid', data.projectCode)
    .addMatch('env', data.projectEnv)
    .addRange('date', {
      gte: +data.startTime,
      lte: +data.endTime,
    })

  const query = {
    bool: {
      must: must.values(),
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
      date: {
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
  const { aggregations, records } = await getLogs(data)
  const { value } = aggregations.count ?? {}

  return new ApiData(0, '查询项目列表成功', {
    records,
    pagination: {
      current: data.current,
      pageSize: data.pageSize,
      total: value,
    },
  })
}
