import { Op, Sequelize } from 'sequelize'
import { Log } from '../../../../../schemas'
import { StatParams } from '../../../../../types'
import { LogType } from '../../../../../types/log'
import { ApiData } from '../../../../../utils/response'

interface PerformancePageWaterfallParams extends StatParams {
  page?: string
}

const getWaterfall =async ({
  projectCode,
  projectEnv,
  startTime,
  endTime,
  page,
}: PerformancePageWaterfallParams) => {
  const [data] = await Log.findAll({
    where: {
      pid: projectCode,
      env: projectEnv,
      type: LogType.PERF,
      page: page || false,
      reportTime: {
        [Op.between]: [+startTime, +endTime]
      }
    },
    attributes: [
      // [Sequelize.fn('AVG', Sequelize.col('ttfb')), 'ttfb'],
      // [Sequelize.fn('AVG', Sequelize.col('ready')), 'ready'],
      // [Sequelize.fn('AVG', Sequelize.col('load')), 'load'],
      // [Sequelize.fn('AVG', Sequelize.col('lcp')), 'lcp'],

      [Sequelize.fn('AVG', Sequelize.col('dns')), 'dns'],
      [Sequelize.fn('AVG', Sequelize.col('tcp')), 'tcp'],
      [Sequelize.fn('AVG', Sequelize.col('ssl')), 'ssl'],
      [Sequelize.fn('AVG', Sequelize.col('trans')), 'trans'],
      [Sequelize.fn('AVG', Sequelize.col('dom')), 'dom'],
      [Sequelize.fn('AVG', Sequelize.col('res')), 'res'],
    ],

    raw: true
  })

  return data
}

export const performancePageWaterfall = async (
  params: PerformancePageWaterfallParams
) => {
  const { dns, tcp, ssl, ttfb, trans, dom, res } = await getWaterfall(params)

  return new ApiData(0, 'OK', [
    {
      key: 'dns',
      value: +dns,
    },
    {
      key: 'tcp',
      value: +tcp,
    },
    {
      key: 'ssl',
      value: +ssl,
    },
    {
      key: 'ttfb',
      value: +ttfb,
    },
    {
      key: 'trans',
      value: +trans,
    },
    {
      key: 'dom',
      value: +dom,
    },
    {
      key: 'res',
      value: +res,
    },
  ])
}
