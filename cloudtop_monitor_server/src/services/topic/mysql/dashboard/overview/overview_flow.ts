import { ApiData } from '../../../../../utils/response'
import { StatParams } from '../../../../../types'
import { Log } from '../../../../../schemas'
import { Op, Sequelize } from 'sequelize'

const calculateFrequency = (n1: number, n2: number) => {
  if (!n2) return null
  return Number((n1 / n2).toFixed(2))
}

const calculateRatio = (n1: number, n2: number) => {
  if (!n2) return null
  return Number(((n1 - n2) / n2).toFixed(4))
}

const getCardinality = async(query: StatParams) => {
  const [stat] = await Log.findAll({
    attributes: [
      [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('pv_id'))), 'pv'],
      [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('uid'))), 'uv'],
      [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('remote_addr'))), 'ip'],
    ],
    where: {
      pid: query.projectCode,
      env: query.projectEnv,
      reportTime: {
        [Op.between]: [query.startTime.valueOf(), query.endTime.valueOf()]
      }
    }
  })

  return stat.dataValues
}

export const overviewFlow = async (data: StatParams) => {

  const [f1, f2] = await Promise.all([
    getCardinality(data),
    getCardinality({
      ...data,
      startTime: data.startTime.subtract(1, 'day'),
      endTime: data.endTime.subtract(1, 'day'),
    }),
  ])

  return new ApiData(0, '获取流量数据成功', [
    {
      type: 'pv',
      value: f1.pv,
      ratio: calculateRatio(f1.pv, f2.pv),
    },
    {
      type: 'uv',
      value: f1.uv,
      ratio: calculateRatio(f1.uv, f2.uv),
    },
    // TODO 新用户数需要缓存计算
    // {
    //   type: 'newUv',
    //   value: f1.uv.value,
    //   ratio: calculateRatio(f1.uv.value, f2.uv.value),
    // },
    {
      type: 'ip',
      value: f1.ip,
      ratio: calculateRatio(f1.ip, f2.ip),
    },
    {
      type: 'frequency',
      value: calculateFrequency(f1.pv, f1.uv),
      ratio: calculateRatio(
        calculateFrequency(f1.pv, f1.uv)!,
        calculateFrequency(f2.pv, f2.uv)!
      ),
    },
  ])
}
