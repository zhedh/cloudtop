import { Dayjs } from 'dayjs'
import { count } from '../elastic'
import { ApiData } from '../../utils/response'
import { LogType } from '../../types/log'

export interface ProjectStatParams {
  projectCode: string
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

const getStat = ({ projectCode, startTime, endTime }: ProjectStatParams) => {
  const query = {
    bool: {
      must: [
        {
          match: { pid: projectCode },
        },
        {
          match: { env: 'production' }, // TODO 默认获取生产环境的数据
        },
        {
          range: {
            date: {
              gte: +startTime,
              lte: +endTime,
            },
          },
        },
      ],
    },
  }

  const aggs = {
    pv: {
      cardinality: {
        field: 'pv_id.keyword',
      },
    },
    uv: {
      cardinality: {
        field: 'uid.keyword',
      },
    },
    error: {
      filter: {
        term: {
          type: LogType.ERROR,
        },
      },
      aggs: {
        pv_error: {
          cardinality: {
            field: 'pv_id.keyword',
          },
        },
      },
    },
    resource_error: {
      filter: {
        term: {
          type: LogType.RESOURCE_ERROR,
        },
      },
      aggs: {
        pv_resource_error: {
          cardinality: {
            field: 'pv_id.keyword',
          },
        },
      },
    },
  }

  const sort = [
    {
      date: {
        order: 'desc',
      },
    },
  ]

  return count({ query, aggs, sort })
}

export const projectStat = async (data: ProjectStatParams) => {
  const { pv, uv, error, resource_error } = await getStat(data)

  const errorRatio = error.pv_error.value / pv.value
  const resourceErrorRatio = resource_error.pv_resource_error.value / pv.value

  const result = {
    pv: pv.value,
    uv: uv.value,
    error: error.doc_count,
    errorRatio: +errorRatio.toFixed(4),
    resourceError: resource_error.doc_count,
    resourceErrorRatio: +resourceErrorRatio.toFixed(4),
    score:
      calculateScore(errorRatio) * 0.6 +
      calculateScore(resourceErrorRatio) * 0.4,
  }

  return new ApiData(0, '获取流量数据成功', result)
}
