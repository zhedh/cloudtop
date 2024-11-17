import { Dayjs } from 'dayjs'
import { ApiData } from '../../../../utils/response'
import { LogEnv, LogType } from '../../../../types/log'
import { Log } from '../../../../schemas'
import { Op, Sequelize } from 'sequelize'

export interface ProjectStatParams {
  projectCode: string
  projectEnv: LogEnv
  startTime: Dayjs
  endTime: Dayjs
}

const calculateScore = (ratio: number = 0) => {
  if (ratio <= 0.5 / 100) {
    return 100
  }
  if (ratio <= 10 / 100) {
    return 100 - 10 * ratio * 100
  }

  return 0
}

const getStat = async(data: ProjectStatParams) => {
  const [stat] = await Log.findAll({
    attributes: [
      [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('pv_id'))), 'pv'],
      [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('uid'))), 'uv'],
      [Sequelize.literal(`SUM(CASE WHEN type = '${LogType.ERROR}' THEN 1 ELSE 0 END)`), 'error'],
      [Sequelize.literal(`SUM(CASE WHEN type = '${LogType.RESOURCE_ERROR}' THEN 1 ELSE 0 END)`), 'resourceError']
    ],
    where: {
      pid: data.projectCode,
      env: data.projectEnv,
      reportTime: {
        [Op.between]: [data.startTime.valueOf(), data.endTime.valueOf()]
      }
    }
  }) 

  return {
    pv: stat.dataValues.pv,
    uv: stat.dataValues.uv,
    error: +stat.dataValues.error,
    resourceError: +stat.dataValues.resourceError,
  }
}

/**
 * 应用基础信息统计
 * @param data 
 * @returns 
 */
export const projectStat = async (data: ProjectStatParams) => {

  const { pv, uv, error, resourceError } = await getStat(data)
  const errorRatio = pv ? error / pv : 0
  const resourceErrorRatio = pv ? resourceError / pv : 0

  const result = {
    pv: pv,
    uv: uv,
    error: error,
    errorRatio: errorRatio.toFixed(4),
    resourceError: resourceError,
    resourceErrorRatio: +resourceErrorRatio.toFixed(4),
    score:
      calculateScore(errorRatio) * 0.6 +
      calculateScore(resourceErrorRatio) * 0.4,
  }

  return new ApiData(0, '获取流量数据成功', result)
}
