import { count } from '../../../database/elastic'
import { StatParams } from '../../../types'
import { LogType } from '../../../types/log'
import { ElasticBoolMust } from '../../../utils/elastic_bool'
import { ApiData } from '../../../utils/response'

interface PerformancePageDataParams extends StatParams {
  timeInterval: number // 时间间隔，单位（秒）
}

const getData = ({
  projectCode,
  projectEnv,
  startTime,
  endTime,
  timeInterval,
}: PerformancePageDataParams) => {
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
    data: {
      date_histogram: {
        field: 'date',
        interval: timeInterval + 's',
        format: 'yyyy-MM-dd HH:mm',
        time_zone: '+08:00',
      },
      aggs: {
        ttfb: { stats: { field: 'ttfb' } }, // 网络请求耗时。等待接收响应的第一个字节所花费的时间
        ready: { stats: { field: 'ready' } },
        load: { stats: { field: 'load' } },
        lcp: { stats: { field: 'lcp' } },

        dns: { stats: { field: 'dns' } }, // DNS连接耗时（毫秒，下面字段涉及到耗时的单位都是毫秒）
        tcp: { stats: { field: 'tcp' } }, // TCP连接耗时
        ssl: { stats: { field: 'ssl' } }, // SSL连接耗时
        trans: { stats: { field: 'trans' } }, // 数据传输耗时
        dom: { stats: { field: 'dom' } }, // DOM解析耗时
        res: { stats: { field: 'res' } }, // 资源加载耗时
      },
    },
  }

  return count({ query, aggs })
}

export const performancePageData = async (
  params: PerformancePageDataParams
) => {
  const { data } = await getData(params)

  const records = data.buckets.map((i: Record<string, any>) => ({
    key: i.key_as_string,
    count: i.doc_count,
    ttfb: i.ttfb.avg,
    ready: i.ready.avg,
    load: i.load.avg,
    lcp: i.lcp.avg,

    dns: i.dns.avg,
    tcp: i.tcp.avg,
    ssl: i.ssl.avg,
    // ttfb: i.ttfb.avg,
    trans: i.trans.avg,
    dom: i.dom.avg,
    res: i.res.avg,
  }))

  return new ApiData(0, 'OK', records)
}
