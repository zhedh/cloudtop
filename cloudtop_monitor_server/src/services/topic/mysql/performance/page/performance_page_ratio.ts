import { Op, Sequelize } from 'sequelize'
import { Log } from '../../../../../schemas'
import { StatParams } from '../../../../../types'
import { LogType } from '../../../../../types/log'
import { ApiData } from '../../../../../utils/response'

interface PerformancePageRatioParams extends StatParams {
  fieldType: string
}

const getData = async({
  projectCode,
  projectEnv,
  startTime,
  endTime,
  fieldType,
}: PerformancePageRatioParams) => {
  const {rows, count} = await Log.findAndCountAll({
    where: {
      pid: projectCode,
      env: projectEnv,
      type: LogType.PERF,
      reportTime: {
        [Op.between]: [+startTime, +endTime]
      }
    },
    attributes: [
      [fieldType, 'key'],
      [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
      [Sequelize.fn('AVG', Sequelize.col('dns')), 'dns'],
      [Sequelize.fn('AVG', Sequelize.col('tcp')), 'tcp'],
      [Sequelize.fn('AVG', Sequelize.col('ssl')), 'ssl'],
      [Sequelize.fn('AVG', Sequelize.col('trans')), 'trans'],
      [Sequelize.fn('AVG', Sequelize.col('dom')), 'dom'],
      [Sequelize.fn('AVG', Sequelize.col('res')), 'res'],
    ],

    raw: true,
    group: [fieldType]
  })

  return { rows, count }
}

export const performancePageRatio = async (
  params: PerformancePageRatioParams
) => {
  const { rows, count } = await getData(params)
  return new ApiData(0, 'OK', {
    total: count,
    records: rows.map((i: Record<string, any>)=> ({
      key: i.key,
      count: i.count,
      dns: +i.dns,
      tcp: +i.tcp,
      ssl: +i.ssl,
      ttfb: +i.ttfb,
      trans: +i.trans,
      dom: +i.dom,
      res: +i.res,
    }))
  })
}
