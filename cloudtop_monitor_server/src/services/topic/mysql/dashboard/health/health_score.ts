import { ApiData } from '../../../../../utils/response'
import { LogType } from '../../../../../types/log'
import { calculateRatio, calculateScore } from '../../../../../utils/calculate'
import { StatParams } from '../../../../../types'
import { Log } from '../../../../../schemas'
import { Op, Sequelize } from 'sequelize'

const getData = async ({
  projectCode,
  projectEnv,
  startTime,
  endTime,
}: StatParams) => {
  const [data] = await Log.findAll({
    where: {
      pid: projectCode,
      env: projectEnv,
      // type: LogType.PV,
      reportTime: {
        [Op.between]: [+startTime, +endTime]
      }
    },

    attributes: [
      [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('pv_id'))), 'pv'],
      [Sequelize.literal(`SUM(CASE WHEN type = '${LogType.ERROR}' THEN 1 ELSE 0 END)`), 'error'],
      [Sequelize.literal(`SUM(CASE WHEN type = '${LogType.RESOURCE_ERROR}' THEN 1 ELSE 0 END)`), 'resourceError'],
      [Sequelize.literal(`SUM(CASE WHEN type = '${LogType.API}' THEN 1 ELSE 0 END)`), 'api'],
      [Sequelize.literal(`SUM(CASE WHEN type = '${LogType.API}' AND success = 0 THEN 1 ELSE 0 END)`), 'apiError'],
    ],
  })

  const { pv, error, resourceError, api, apiError } = data.dataValues

  return {
    pv,
    error: +error,
    resourceError: + resourceError,
    api: +api,
    apiError: +apiError
  }
}

export const healthScore = async (data: StatParams) => {

  const { pv, error, resourceError, api, apiError } = await getData(data)
  const errorRatio = calculateRatio(error, pv)
  const resourceErrorRatio = calculateRatio(resourceError, pv)
  const apiErrorRatio = calculateRatio(apiError, api)

  const scoreNumerator =
    calculateScore(errorRatio) * 3 +
    calculateScore(resourceErrorRatio) * 2 +
    calculateScore(apiErrorRatio) * 3

  const result = {
    score: calculateRatio(scoreNumerator, 8),
    records: [
      {
        type: 'error',
        count: error,
        ratio: errorRatio,
      },
      {
        type: 'resource_error',
        count: resourceError,
        ratio: resourceErrorRatio,
      },
      {
        type: 'api_error',
        count: apiError,
        ratio: apiErrorRatio,
      },
    ],
  }

  return new ApiData(0, 'OK', result)
}
