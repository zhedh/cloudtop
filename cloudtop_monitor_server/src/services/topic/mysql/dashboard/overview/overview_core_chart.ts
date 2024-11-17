import dayjs, { Dayjs } from 'dayjs'
import { ApiData } from '../../../../../utils/response'
import { StatParams } from '../../../../../types'
import { Op, Sequelize } from 'sequelize'
import { Log } from '../../../../../schemas'

interface HistogramParams {
  projectCode: string
  projectEnv?: string
  startTime: Dayjs
  endTime: Dayjs
}

const getHistogram = async (query: HistogramParams) => {
  // 定义时间区间
  const intervals = Array.from({ length: 24 }).map((_, index) => {
    const startTime = query.startTime.add(index, 'hours')
    const endTime = query.startTime.add(index + 1, 'hours')
    return [startTime, endTime]
  })

  const histogramQuery = intervals.map(async ([startTime, endTime]) => {
    const [data] = await Log.findAll({
      where: {
        pid: query.projectCode,
        env: query.projectEnv,
        reportTime: {
          [Op.gte]: startTime.valueOf(),
          [Op.lt]: endTime.valueOf()
        }
      },
      attributes: [
        [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('pv_id'))), 'pv'],
        [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('uid'))), 'uv'],
      ],
    })
    return { key: startTime.format('YYYY-MM-DD HH:mm:ss'), ...data.dataValues }
  })

  return Promise.all(histogramQuery)
}

export const overviewCoreChart = async (data: StatParams) => {
  const { projectCode, projectEnv, startTime, endTime } = data

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

  const list = await Promise.all(
    timeList.map((time) => getHistogram({ ...time, projectCode, projectEnv }))
  )

  const result = list.map((histogram, index) => ({
    key: timeList[index].key,
    date: dayjs(timeList[index].startTime).format('YYYY-MM-DD'),
    data: histogram,
  }))

  return new ApiData(0, '获取流量数据成功', result)
}
