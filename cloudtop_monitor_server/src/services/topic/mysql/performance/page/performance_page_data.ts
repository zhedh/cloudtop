import { Op, Sequelize } from 'sequelize'
import { Log } from '../../../../../schemas'
import { StatParams } from '../../../../../types'
import { LogType } from '../../../../../types/log'
import { ApiData } from '../../../../../utils/response'
import { datetimeGroup } from '../../../../../utils/datetime'
import dayjs from 'dayjs'

interface PerformancePageDataParams extends StatParams {
  timeInterval: number // 时间间隔，单位（秒）
}

const getTimeFormat = (timeInterval: number) => {
  if (timeInterval % (60 * 60 * 24) === 0) {
    return '%Y-%m-%d 00:00:00'
  }

  if (timeInterval % (60 * 60)  === 0) {
    return '%Y-%m-%d %H:00:00'
  }

  return '%Y-%m-%d %H:%i:00'
}

const getData = async({
  projectCode,
  projectEnv,
  startTime,
  endTime,
  timeInterval,
}: PerformancePageDataParams) => {
  const timeFormat = getTimeFormat(timeInterval)

  const records = await Log.findAll({
    where: {
      pid: projectCode,
      env: projectEnv,
      type: LogType.PERF,
      reportTime: {
        [Op.between]: [+startTime, +endTime]
      }
    },
    attributes: [
      [Sequelize.fn('DATE_FORMAT', Sequelize.col('report_time'), timeFormat), 'key'],
      [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'], 
      [Sequelize.fn('AVG', Sequelize.col('ttfb')), 'ttfb'],
      [Sequelize.fn('AVG', Sequelize.col('ready')), 'ready'],
      [Sequelize.fn('AVG', Sequelize.col('load')), 'load'],
      [Sequelize.fn('AVG', Sequelize.col('lcp')), 'lcp'],

      [Sequelize.fn('AVG', Sequelize.col('dns')), 'dns'],
      [Sequelize.fn('AVG', Sequelize.col('tcp')), 'tcp'],
      [Sequelize.fn('AVG', Sequelize.col('ssl')), 'ssl'],
      [Sequelize.fn('AVG', Sequelize.col('trans')), 'trans'],
      [Sequelize.fn('AVG', Sequelize.col('dom')), 'dom'],
      [Sequelize.fn('AVG', Sequelize.col('res')), 'res'],
    ],

    group: ['key'],
    order: [[Sequelize.col('key'), 'ASC']], // 可选：按日期排序结果
    raw: true
  })

  const map = records.reduce((map, record: Record<string,any>)=> {
    const key = record.key

    map[key] = {
      ...record,
      key: key,
      count: record.count,
      ttfb: +record.ttfb,
      ready: +record.ready,
      load: +record.load,
      lcp: +record.lcp,

      dns: +record.dns,
      tcp: +record.tcp,
      ssl: +record.ssl,
      trans: +record.trans,
      dom: +record.dom,
      res: +record.res,
    }
    return map
  }, {} as Record<string, Record<string, any>>)

  const list = datetimeGroup(+startTime, Math.min(+endTime, + new Date()) , timeInterval * 1000).map(time=> {
    const key = dayjs(time).format('YYYY-MM-DD HH:mm:ss')
    return map[key] || {
      key,
      count: 0,
      ttfb: 0,
      ready: 0,
      load: 0,
      lcp: 0,

      dns: 0,
      tcp: 0,
      ssl: 0,
      trans: 0,
      dom: 0,
      res: 0,
    }
  })

  return list
}

export const performancePageData = async (
  params: PerformancePageDataParams
) => {
  return new ApiData(0, 'OK', await getData(params))
}
