import { Op, Sequelize } from 'sequelize'
import { Log } from '../../../../../schemas'
import { StatParams } from '../../../../../types'
import { LogType } from '../../../../../types/log'
import { ApiData } from '../../../../../utils/response'

interface PerformanceApiTerminalParams extends StatParams {
  terminalType: string
}

const getData = async({
  projectCode,
  projectEnv,
  startTime,
  endTime,
  terminalType,
}: PerformanceApiTerminalParams) => {

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
      [terminalType, 'key'],
      [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
      [Sequelize.literal('SUM(CASE WHEN time < 1000 THEN 1 ELSE 0 END)'), '0.0-1000.0'],
      [Sequelize.literal('SUM(CASE WHEN time >= 1000 AND time < 5000 THEN 1 ELSE 0 END)'), '1000.0-5000.0'],
      [Sequelize.literal('SUM(CASE WHEN time >= 5000 AND time < 10000 THEN 1 ELSE 0 END)'), '5000.0-10000.0'],
      [Sequelize.literal('SUM(CASE WHEN time >= 10000 AND time < 30000 THEN 1 ELSE 0 END)'), '10000.0-30000.0'],
      [Sequelize.literal('SUM(CASE WHEN time >= 30000 THEN 1 ELSE 0 END)'), '30000.0-*'],
       ],
    raw: true,
    limit: 1000,
    group: [terminalType]
  })

  return records
}

export const performanceApiTerminal = async (
  params: PerformanceApiTerminalParams
) => {
  const TIME_KEYS = ['0.0-1000.0', '1000.0-5000.0', '5000.0-10000.0', '10000.0-30000.0', '30000.0-*']
  const data = await getData(params)
  const records = data.map((i: Record<string, any>) => {
    return {
      key: i.key,
      count: i.count,
      times : TIME_KEYS.map(key=> ({
        key,
        count: i[key]
      }))
    }
  })

  return new ApiData(0, 'OK', records)
}
