import { Op, Sequelize } from 'sequelize'
import { Log } from '../../../../../schemas'
import { StatParams } from '../../../../../types'
import { LogType } from '../../../../../types/log'
import { ApiData } from '../../../../../utils/response'

const getData =async({
  projectCode,
  projectEnv,
  startTime,
  endTime,
}: StatParams) => {

 const [data] = await Log.findAll({
    where: {
      pid: projectCode,
      env: projectEnv,
      type: LogType.PERF,
      reportTime: {
        [Op.between]: [startTime.valueOf(), endTime.valueOf()]
      }
    },
    attributes: [
      [Sequelize.fn('AVG', Sequelize.col('ttfb')), 'ttfb'],
      [Sequelize.fn('AVG', Sequelize.col('ready')), 'ready'],
      [Sequelize.fn('AVG', Sequelize.col('load')), 'load'],
      [Sequelize.fn('AVG', Sequelize.col('lcp')), 'lcp']
    ]
  })

  const { ttfb, ready, load, lcp } =  data.dataValues
  return {
    ttfb: +ttfb,
    ready: +ready,
    load: +load,
    lcp: +lcp
  }
}

export const performancePageStat = async (params: StatParams) => {
  const res = await getData(params)
  return new ApiData(0, 'OK', res)
}
