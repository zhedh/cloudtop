import { ApiData } from '../../../utils/response'
import { count } from '../../elastic'
import { LogType } from '../../../types/log'
import { StatParams } from '../../../types'
import { ElasticBoolMust } from '../../../utils/elastic_bool'

// 目前仅返回十条
const SIZE = 10

const format = (type: string, data: Record<string, any>, key?: string) => {
  const { buckets } = data
  return {
    type,
    records: buckets.map((i: Record<string, any>) => ({
      key: i.key,
      value: key ? i[key].value : i.doc_count,
    })),
  }
}

const collapse = (data: {
  type: string
  records: { key: string; value: number }[]
}) => {
  const map: Record<string, number> = {}
  const reg = /^https?:\/\/[^\?\#\/]*/
  data.records.forEach((i) => {
    const [k = ''] = reg.exec(i.key) || []
    map[k] ? (map[k] += i.value) : (map[k] = i.value)
  })

  let records = Object.keys(map).map((key) => ({ key, value: map[key] }))
  records = records.sort((a, b) => b.value - a.value)

  return {
    type: data.type,
    records: records.slice(0, SIZE),
  }
}

const getHistogram = (data: StatParams) => {
  const { projectCode, projectEnv, startTime, endTime } = data

  const must = new ElasticBoolMust()
    .addMatch('pid', projectCode)
    .addMatch('env', projectEnv)
    .addMatch('type', LogType.PV)
    .addRange('date', {
      gte: +startTime,
      lte: +endTime,
    })

  const query = { bool: { must: must.values() } }

  const aggs = {
    page: {
      terms: {
        field: 'page.keyword',
        order: {
          _count: 'desc',
        },
      },
    },
    dr: {
      terms: {
        field: 'dr.keyword',
        order: {
          _count: 'desc',
        },
        size: 10000,
      },
    },
    os: {
      terms: {
        field: 'os.keyword',
        order: {
          uv: 'desc',
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
    browser: {
      terms: {
        field: 'browser.keyword',
        order: {
          uv: 'desc',
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
  }

  return count({ query, aggs })
}

export const overviewSyntheticChart = async (data: StatParams) => {
  const { page, dr, os, browser } = await getHistogram(data)

  return new ApiData(0, '获取数据成功', [
    format('page', page),
    collapse(format('dr', dr)),
    format('os', os, 'uv'),
    format('browser', browser, 'uv'),
  ])
}
