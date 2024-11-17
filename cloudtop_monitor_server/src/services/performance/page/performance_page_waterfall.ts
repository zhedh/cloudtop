import { count } from '../../../database/elastic'
import { StatParams } from '../../../types'
import { LogType } from '../../../types/log'
import { ElasticBoolMust } from '../../../utils/elastic_bool'
import { ApiData } from '../../../utils/response'

interface PerformancePageWaterfallParams extends StatParams {
  page?: string
}

const getWaterfall = ({
  projectCode,
  projectEnv,
  startTime,
  endTime,
  page,
}: PerformancePageWaterfallParams) => {
  const must = new ElasticBoolMust()
    .addMatch('pid', projectCode)
    .addMatch('env', projectEnv)
    .addMatch('type', LogType.PERF)
    .addMatch('page.keyword', page)
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
    dns: { stats: { field: 'dns' } }, // DNS连接耗时（毫秒，下面字段涉及到耗时的单位都是毫秒）
    tcp: { stats: { field: 'tcp' } }, // TCP连接耗时
    ssl: { stats: { field: 'ssl' } }, // SSL连接耗时
    ttfb: { stats: { field: 'ttfb' } }, // 网络请求耗时。等待接收响应的第一个字节所花费的时间
    trans: { stats: { field: 'trans' } }, // 数据传输耗时
    dom: { stats: { field: 'dom' } }, // DOM解析耗时
    res: { stats: { field: 'res' } }, // 资源加载耗时

    // firstbyte: { stats: { field: 'firstbyte' } },
    // ready: { stats: { field: 'ready' } },
    // load: { stats: { field: 'load' } },
  }

  return count({ query, aggs })
}

export const performancePageWaterfall = async (
  params: PerformancePageWaterfallParams
) => {
  const { dns, tcp, ssl, ttfb, trans, dom, res } = await getWaterfall(params)

  console.log('dns:: ', dns)

  return new ApiData(0, 'OK', [
    {
      key: 'dns',
      value: dns.avg,
    },
    {
      key: 'tcp',
      value: tcp.avg,
    },
    {
      key: 'ssl',
      value: ssl.avg,
    },
    {
      key: 'ttfb',
      value: ttfb.avg,
    },
    {
      key: 'trans',
      value: trans.avg,
    },
    {
      key: 'dom',
      value: dom.avg,
    },
    {
      key: 'res',
      value: res.avg,
    },
  ])
}
