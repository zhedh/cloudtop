import { ApiData } from '../../../../../utils/response'
import { ElasticBoolMust } from '../../../../../utils/elastic_bool'
import { StatParams } from '../../../../../types'
import { count } from '../../../../../database/elastic'

const calculateFrequency = (n1: number, n2: number) => {
  if (!n2) return null
  return Number((n1 / n2).toFixed(2))
}

const calculateRatio = (n1: number, n2: number) => {
  if (!n2) return null
  return Number(((n1 - n2) / n2).toFixed(4))
}

const getCardinality = ({
  projectCode,
  projectEnv,
  startTime,
  endTime,
}: StatParams) => {
  const must = new ElasticBoolMust()
    .addMatch('pid', projectCode)
    .addMatch('env', projectEnv)
    .addRange('date', {
      gte: +startTime,
      lte: +endTime,
    })

  const query = {
    bool: {
      must: must.values(),
    },
  }

  const aggs = {
    pv: {
      cardinality: {
        // 聚合类型为：value_count
        field: 'pv_id.keyword', // 计算type这个字段值的总数
      },
    },
    uv: {
      cardinality: {
        field: 'uid.keyword',
      },
    },
    ip: {
      cardinality: {
        field: 'remote_addr.keyword',
      },
    },
  }

  return count({ query, aggs })
}

export const overviewFlow = async (data: StatParams) => {
  // return new ApiData(
  //   0,
  //   '获取流量数据成功',
  //   await getCardinality(projectCode, [startDate, endDate])
  // )

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
      value: f1.pv.value,
      ratio: calculateRatio(f1.pv.value, f2.pv.value),
    },
    {
      type: 'uv',
      value: f1.uv.value,
      ratio: calculateRatio(f1.uv.value, f2.uv.value),
    },
    // TODO 新用户数需要缓存计算
    // {
    //   type: 'newUv',
    //   value: f1.uv.value,
    //   ratio: calculateRatio(f1.uv.value, f2.uv.value),
    // },
    {
      type: 'ip',
      value: f1.ip.value,
      ratio: calculateRatio(f1.ip.value, f2.ip.value),
    },
    {
      type: 'frequency',
      value: calculateFrequency(f1.pv.value, f1.uv.value),
      ratio: calculateRatio(
        calculateFrequency(f1.pv.value, f1.uv.value)!,
        calculateFrequency(f2.pv.value, f2.uv.value)!
      ),
    },
  ])
}
