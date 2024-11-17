import { Dayjs } from 'dayjs'
import { LogType } from '../../../../../types/log'
import { ApiData } from '../../../../../utils/response'
import { Op, Sequelize } from 'sequelize'
import { Log } from '../../../../../schemas'
import { arrayClassifyByField } from '../../../../../utils/array'

export interface ErrorApiTopListParams {
  projectCode: string
  projectEnv: string
  startTime: Dayjs
  endTime: Dayjs
  sort?: string
  order?: 'desc' | 'asc'
}

const getRecords = async ({
  projectCode,
  projectEnv,
  startTime,
  endTime,
  sort = 'date',  // TODO 后续使用reportTime
  order = 'desc'
}: ErrorApiTopListParams) => {

  const queryCondition = {
    pid: projectCode,
    env: projectEnv,
    type: LogType.API,
    success: 0,
    reportTime: {
      [Op.between]: [+startTime, +endTime]
    }
  }
  const records = await Log.findAll({
    where: queryCondition,
    attributes: [
      'api',
      'status',
      [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
      [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('uid'))), 'userCount'],
      [Sequelize.fn('MIN', Sequelize.col('report_time')), 'minTime'],
      [Sequelize.fn('MAX', Sequelize.col('report_time')), 'maxTime']
    ],
    group: ['api', 'status'],
    raw: true,
    limit: 10,
    order: [
      [sort, order.toUpperCase()]
    ],
  })

  const raws = await Log.findAll({
    where: {
      ...queryCondition,
      [Op.or]: records.map(i=> ({
        [Op.and]: {
          api: i.api,
          status: i.status
        }
      }))
    },
    attributes: ['id', 'date', 'report_time', 'api', 'url', 'status', 'uid'],
    raw: true
  })

  return arrayClassifyByField(records, raws, ['api', 'status'])
}

export const errorApiTopList = async (params: ErrorApiTopListParams) => {
  const data = await getRecords(params)
  return new ApiData(0, '数据查询成功', data.map((i: Record<string,any>) => {
    return {
      ...i,
      key: i.api + '-' + i.status,
      timeRange: [i.minTime, i.maxTime]
    }
  }))
}
