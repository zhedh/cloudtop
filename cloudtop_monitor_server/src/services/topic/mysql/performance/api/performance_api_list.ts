import { StatParams } from '../../../../../types'
import { LogType } from '../../../../../types/log'
import { calculateRatio } from '../../../../../utils/calculate'
import { ApiData } from '../../../../../utils/response'
import { Log } from '../../../../../schemas'
import { Op, Sequelize } from 'sequelize'

interface PerformanceApiListParams extends StatParams {
  api?: string
}

const getHitsSource = (docs: Record<string, any>) => {
  const { hits } = docs.hits

  return hits.map((i: Record<string, any>) => ({ _id: i._id, ...i._source }))
}

const getList = async({
  projectCode,
  projectEnv,
  startTime,
  endTime,
  api,
}: PerformanceApiListParams) => {
  const records = await Log.findAll({
    where: {
      pid: projectCode,
      env: projectEnv,
      type: LogType.API,
      api: {
        [Op.like]: `%${api}%`
      },
      reportTime: {
        [Op.between]: [+startTime, +endTime]
      }
    },
    attributes: [
      'api',
      [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
      [Sequelize.fn('AVG', Sequelize.col('time')), 'time'],
      [Sequelize.literal(`SUM(CASE WHEN success = 0 THEN 1 ELSE 0 END)`), 'errorCount'],
      [Sequelize.literal('COUNT(DISTINCT CASE WHEN success = 0 THEN uid END)'), 'errorUserCount'], // 错误人数（去重）
      [Sequelize.literal(`SUM(CASE WHEN time >= 1000 THEN 1 ELSE 0 END)`), 'slowCount'],
    ],
    raw: true,
    limit: 1000,
    group: ['api']
  })

  return records
}

export const performanceApiList = async (params: PerformanceApiListParams) => {
  const data = await getList(params)

  const records = data.map((i: Record<string, any>) => {
    const successCount = i.count - (+i.errorCount)
    // const source = getHitsSource(i.docs)

    // const [first] = source || []
    // const reg = /^https?:\/\/[^\?\#\/]*/
    // const [origin, date] = reg.exec(first?.src || '') || []

    return {
      api: i.api,
      count: i.count,
      time: +i.time,
      successCount: successCount,
      successRatio: calculateRatio(successCount, i.count),
      slowCount: +i.slowCount,
      slowRatio: calculateRatio(+i.slowCount, i.count),
      errorCount: +i.errorCount,
      errorUserCount: +i.errorUserCount,
      // origin: origin,
      // date: dayjs(date).format('YYYY-MM-DD HH:mm:ss'),
      // source,
    }
  })

  return new ApiData(0, 'OK', records)
}
