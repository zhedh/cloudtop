import { ApiData } from '../../../../../utils/response'
import { LogType } from '../../../../../types/log'
import { StatParams } from '../../../../../types'
import { Log } from '../../../../../schemas'
import { Op, Sequelize } from 'sequelize'

// 目前仅返回十条
const SIZE = 10

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

const getHistogram = async (query: StatParams, field: string) => {
  const { projectCode, projectEnv, startTime, endTime } = query

  const data = await Log.findAll({
    where: {
      pid: projectCode,
      env: projectEnv,
      type: LogType.PV,
      reportTime: {
        [Op.between]: [startTime.valueOf(), endTime.valueOf()]
      }
    },

    attributes: [
      field,
      [Sequelize.fn('COUNT', Sequelize.col(field)), 'count'],
    ],
    group: [field],
    order: [
      ['count', 'DESC']
    ],
    limit: SIZE
  })

  return { 
    type: field, 
    records: data.map(i => ({ key: i.dataValues[field], value: i.dataValues.count })) 
  }
}

export const overviewSyntheticChart = async (data: StatParams) => {
  const histogramQuery = ['page', 'dr', 'os', 'browser'].map((field) => getHistogram(data, field))
  const res = await Promise.all(histogramQuery)

  return new ApiData(0, '获取数据成功', res)
}
