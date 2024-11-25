import { count } from '../../../../../database/elastic'
import { StatParams } from '../../../../../types'
import { LogType } from '../../../../../types/log'
import { calculateRatio } from '../../../../../utils/calculate'
import { ElasticBoolMust } from '../../../../../utils/elastic_bool'
import { ApiData } from '../../../../../utils/response'

interface PerformanceApiDataParams extends StatParams {
  timeInterval: number // 时间间隔，单位（秒）
}

const getData = ({
  projectCode,
  projectEnv,
  startTime,
  endTime,
  timeInterval,
}: PerformanceApiDataParams) => {
  const must = new ElasticBoolMust()
    .addMatch('pid', projectCode)
    .addMatch('env', projectEnv)
    .addMatch('type', LogType.API)
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
    data: {
      date_histogram: {
        field: 'report_time',
        interval: timeInterval + 's',
        format: 'yyyy-MM-dd HH:mm',
        time_zone: '+08:00',
      },
      aggs: {
        time: {
          avg: {
            field: 'time',
          },
        },
        success: {
          filter: {
            term: {
              success: 1, // 0=失败，1=成功
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
      },
    },
  }

  return count({ query, aggs })
}

export const performanceApiData = async (params: PerformanceApiDataParams) => {
  const { data } = await getData(params)

  const records = data.buckets.map((i: Record<string, any>) => ({
    key: i.key_as_string,
    count: i.doc_count,
    time: i.time.value,
    successCount: i.success.doc_count,
    successRatio: calculateRatio(i.success.doc_count, i.doc_count),
    slowCount: i.slow.doc_count,
    slowRatio: calculateRatio(i.slow.doc_count, i.doc_count),
  }))

  return new ApiData(0, 'OK', records)
}
