import { count } from '../../../database/elastic'
import { StatParams } from '../../../types'
import { LogType } from '../../../types/log'
import { ElasticBoolMust } from '../../../utils/elastic_bool'
import { ApiData } from '../../../utils/response'

interface PerformancePageRatioParams extends StatParams {
  fieldType: string
}

const getData = ({
  projectCode,
  projectEnv,
  startTime,
  endTime,
  fieldType,
}: PerformancePageRatioParams) => {
  const must = new ElasticBoolMust()
    .addMatch('pid', projectCode)
    .addMatch('env', projectEnv)
    .addMatch('type', LogType.PERF)
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
    stats: {
      terms: {
        field: `${fieldType}.keyword`,
        size: 1000,
        // order: {
        //   'load.avg': 'desc',
        // },
      },
      aggs: {
        dns: { stats: { field: 'dns' } }, // DNS连接耗时（毫秒，下面字段涉及到耗时的单位都是毫秒）
        tcp: { stats: { field: 'tcp' } }, // TCP连接耗时
        ssl: { stats: { field: 'ssl' } }, // SSL连接耗时
        ttfb: { stats: { field: 'ttfb' } }, // 网络请求耗时。等待接收响应的第一个字节所花费的时间
        trans: { stats: { field: 'trans' } }, // 数据传输耗时
        dom: { stats: { field: 'dom' } }, // DOM解析耗时
        res: { stats: { field: 'res' } }, // 资源加载耗时
      },
    },
  }

  return count({ query, aggs })
}

export const performancePageRatio = async (
  params: PerformancePageRatioParams
) => {
  const { stats, total } = await getData(params)
  const records = stats.buckets.map((i: Record<string, any>) => ({
    key: i.key,
    count: i.doc_count,
    dns: i.dns.avg,
    tcp: i.tcp.avg,
    ssl: i.ssl.avg,
    ttfb: i.ttfb.avg,
    trans: i.trans.avg,
    dom: i.dom.avg,
    res: i.res.avg,
  }))

  return new ApiData(0, 'OK', {
    total,
    records,
  })
}
