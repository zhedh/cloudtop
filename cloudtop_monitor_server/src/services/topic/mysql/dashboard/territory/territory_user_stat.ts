import { Op, Sequelize } from 'sequelize'
import { Log } from '../../../../../schemas'
import { StatParams } from '../../../../../types'
import { ApiData } from '../../../../../utils/response'

// TODO 准确性待验证
const getData = async({
  projectCode,
  projectEnv,
  startTime,
  endTime,
}: StatParams) => {

  const records = await Log.findAll({
    where: {
      pid: projectCode,
      env: projectEnv,
      // type: LogType.PERF,
      reportTime: {
        [Op.between]: [+startTime, +endTime]
      }
    },
    attributes: [
      'ipRegionName',
      [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('uid'))), 'value'],
      // [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
      // [Sequelize.fn('AVG', Sequelize.col('load')), 'load'],
    ],
    group: ['ipRegionName']
  })

  return records.map((i) => ({
    key: i.ipRegionName || '未知',
    value: i.dataValues.value,
  }))

  // const must = new ElasticBoolMust()
  //   .addMatch('pid', projectCode)
  //   .addMatch('env', projectEnv)
  //   .addRange('date', {
  //     gte: +startTime,
  //     lte: +endTime,
  //   })

  // const query = {
  //   bool: {
  //     must: must.values(),
  //   },
  // }

  // const aggs = {
  //   stats: {
  //     terms: {
  //       field: 'ip_region_name.keyword',
  //       size: 1000,
  //     },
  //     aggs: {
  //       uv: {
  //         cardinality: {
  //           field: 'uid.keyword',
  //         },
  //       },
  //     },
  //   },
  // }

  // return count({ query, aggs })
}

export const territoryUserStat = async (params: StatParams) => {
  return new ApiData(0, 'OK', await getData(params))
  // const { stats } = await getData(params)
  // const result = stats.buckets.map((i: Record<string, any>) => ({
  //   key: i.key,
  //   value: i.uv.value,
  // }))

  // return new ApiData(0, 'OK', result)
}
