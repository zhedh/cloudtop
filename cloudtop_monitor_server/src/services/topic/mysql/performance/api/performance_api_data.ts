import { Op, Sequelize } from 'sequelize'
import { Log } from '../../../../../schemas'
import { StatParams } from '../../../../../types'
import { LogType } from '../../../../../types/log'
import { calculateRatio } from '../../../../../utils/calculate'
import { ApiData } from '../../../../../utils/response'
import { datetimeGroup } from '../../../../../utils/datetime'
import dayjs from 'dayjs'

interface PerformanceApiDataParams extends StatParams {
  timeInterval: number // 时间间隔，单位（秒）
}

const getTimeFormat = (timeInterval: number) => {
  if (timeInterval % (60 * 60 * 24) === 0) {
    return '%Y-%m-%d 00:00:00'
  }

  if (timeInterval % (60 * 60) === 0) {
    return '%Y-%m-%d %H:00:00'
  }

  return '%Y-%m-%d %H:%i:00'
}

const getData = async ({
  projectCode,
  projectEnv,
  startTime,
  endTime,
  timeInterval,
}: PerformanceApiDataParams) => {
  const timeFormat = getTimeFormat(timeInterval)

  const records = await Log.findAll({
    where: {
      pid: projectCode,
      env: projectEnv,
      type: LogType.API,
      reportTime: {
        [Op.between]: [+startTime, +endTime]
      }
    },
    attributes: [
      [Sequelize.fn('DATE_FORMAT', Sequelize.col('report_time'), timeFormat), 'key'],
      [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
      [Sequelize.fn('AVG', Sequelize.col('time')), 'time'],
      [Sequelize.literal(`SUM(CASE WHEN success = 1 THEN 1 ELSE 0 END)`), 'successCount'],
      [Sequelize.literal(`SUM(CASE WHEN time >= 1000 THEN 1 ELSE 0 END)`), 'slowCount'],
    ],

    group: ['key'],
    order: [[Sequelize.col('key'), 'ASC']], // 可选：按日期排序结果
    raw: true
  })

  return records
}

export const performanceApiData = async (params: PerformanceApiDataParams) => {
  const records = await getData(params)

  const map = records.reduce((map: Record<string, Record<string, any>>, record: Record<string, any>) => {
    const key = record.key

    map[key] = {
      ...record,
      key: key,
      count: record.count,
      time: +record.time,
      successCount: +record.successCount,
      successRatio: calculateRatio(+record.successCount, +record.count),
      slowCount: +record.slowCount,
      slowRatio: calculateRatio(+record.slowCount, +record.count),
    }
    return map
  }, {})

  const list = datetimeGroup(+params.startTime, Math.min(+params.endTime, + new Date()), params.timeInterval * 1000).map(time => {
    const key = dayjs(time).format('YYYY-MM-DD HH:mm:ss')
    return map[key] || {
      key: key,
      count: 0,
      time: 0,
      successCount: 0,
      successRatio: 0,
      slowCount: 0,
      slowRatio: 0,
    }
  })

  return new ApiData(0, 'OK', list)
}
