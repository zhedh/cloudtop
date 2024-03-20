import dayjs from 'dayjs'
import { ApiData } from '../../../utils/response'
import { count } from '../../elastic'
import { StatParams } from '../../../types'
import { ElasticBoolMust } from '../../../utils/elastic_bool'

export enum HealthChartType {
  ERROR = 'error',
  RESOURCE_ERROR = 'resource_error',
  API_ERROR = 'api_error',
}

export interface HealthChartParams extends StatParams {
  type: HealthChartType
}

export const HEALTH_CHART_TYPE_LIST = [
  HealthChartType.ERROR,
  HealthChartType.RESOURCE_ERROR,
  HealthChartType.API_ERROR,
]

const getData = ({
  projectCode,
  projectEnv,
  startTime,
  endTime,
  type,
}: HealthChartParams) => {
  const must = new ElasticBoolMust()
    .addMatch('pid', projectCode)
    .addMatch('env', projectEnv)
    .addRange('date', {
      gte: +startTime,
      lte: +endTime,
    })

  if (type === HealthChartType.API_ERROR) {
    must.addMatch('type', 'api')
    must.addMatch('success', 0)
  } else {
    must.addMatch('type', type)
  }

  const query = {
    bool: {
      must: must.values(),
    },
  }

  const aggs = {
    histogram: {
      date_histogram: {
        field: 'date',
        interval: '30m',
        format: 'yyyy-MM-dd HH:mm:ss',
        time_zone: '+08:00',
        extended_bounds: {
          min: startTime.format('YYYY-MM-DD HH:mm:ss'),
          max: endTime.format('YYYY-MM-DD HH:mm:ss'),
        },
      },
    },
  }

  return count({ query, aggs })
}

export const healthChart = async (data: HealthChartParams) => {
  const { startTime, endTime } = data
  const timeList = [
    // 选中的时间
    {
      key: 'currentDate',
      startTime,
      endTime,
    },
    // 一天前
    {
      key: 'dayBeforeDate',
      startTime: startTime.subtract(1, 'day'),
      endTime: endTime.subtract(1, 'day'),
    },
    // 一周前
    {
      key: 'weekBeforeDate',
      startTime: startTime.subtract(1, 'week'),
      endTime: endTime.subtract(1, 'week'),
    },
  ]

  const fns = timeList.map(({ startTime, endTime }) =>
    getData({
      ...data,
      startTime,
      endTime,
    })
  )
  const list = await Promise.all(fns)
  const result = list.map(({ histogram }, index) => ({
    key: timeList[index].key,
    date: dayjs(timeList[index].startTime).format('YYYY-MM-DD'),
    data: histogram.buckets.map(
      ({ key_as_string, doc_count }: Record<string, any>) => ({
        key: key_as_string,
        value: doc_count,
      })
    ),
  }))

  return new ApiData(0, 'OK', result)
}
