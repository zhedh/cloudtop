import dayjs from 'dayjs'
import { ApiData } from '../../../../../utils/response'
import { StatParams } from '../../../../../types'
import { Log } from '../../../../../schemas'
import { Op, Sequelize } from 'sequelize'

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

  // 定义时间区间
  const intervals = Array.from({ length: 48 }).map((_, index) => {
    const a = startTime.add(index * 30, 'minute')
    const b = startTime.add((index + 1) * 30, 'minute')
    return [a, b]
  })

  let params =  {
    pid: projectCode,
    env: projectEnv,
    
  } as Record<string,any>

  if (type === HealthChartType.API_ERROR) {
    params.type = 'api'
    params.success = 0
  } else {
    params.type = type
  }

  const histogramQuery = intervals.map(async ([startTime, endTime]) => {
    const [data] = await Log.findAll({
      where: {
        ...params,
        reportTime: {
          [Op.gte]: startTime.valueOf(),
          [Op.lt]: endTime.valueOf()
        }
      },
      attributes: [
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
      ],
    })
    const { count } = data.dataValues
    return { key: startTime.format('YYYY-MM-DD HH:mm:ss'), value: count }
  })

  return Promise.all(histogramQuery)
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
  const result = list.map((histogram, index) => ({
    key: timeList[index].key,
    date: dayjs(timeList[index].startTime).format('YYYY-MM-DD'),
    data: histogram
  }))

  return new ApiData(0, 'OK', result)
}
