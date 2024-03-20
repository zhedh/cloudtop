import dayjs, { Dayjs } from 'dayjs'
import { ApiData } from '../../../utils/response'
import { count } from '../../elastic'
import { LogType } from '../../../types/log'
import { StatParams } from '../../../types'
import { ElasticBoolMust } from '../../../utils/elastic_bool'

interface HistogramParams {
  projectCode: string
  projectEnv?: string
  startTime: Dayjs
  endTime: Dayjs
}

const getHistogram = (data: HistogramParams) => {
  const { projectCode, projectEnv, startTime, endTime } = data

  const must = new ElasticBoolMust()
    .addMatch('pid', projectCode)
    .addMatch('env', projectEnv)
    .addMatch('type', LogType.PV)
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
    // count: {
    //   value_count: {
    //     field: 'pv_id.keyword',
    //   },
    // },

    // terms: {
    //   field: 'uid.keyword',
    // },
    histogram: {
      date_histogram: {
        field: 'date',
        interval: '60m',
        format: 'yyyy-MM-dd HH:mm:ss',
        time_zone: '+08:00',
        extended_bounds: {
          min: dayjs(startTime).format('YYYY-MM-DD HH:mm:ss'),
          max: dayjs(endTime).format('YYYY-MM-DD HH:mm:ss'),
        },
      },

      aggs: {
        uv: {
          cardinality: {
            field: 'uid.keyword',
          },
        },
      },

      // range: {
      //   field: 'date',
      //   ranges: [
      //     // { to: +startDate },
      //     { from: +startDate, to: +endDate + 1 },
      //     { from: +dayBeforeStartDate, to: +dayBeforeendDate + 1 },
      //     { from: +weekBeforeStartDate, to: +weekBeforeendDate + 1 },

      //     // { from: +endDate },
      //   ],
      // },
    },
  }

  return count({ query, aggs })
}

export const overviewCoreChart = async (data: StatParams) => {
  const { projectCode, projectEnv, startTime, endTime } = data

  const timeList = [
    // 选中的时间
    {
      key: 'currentDate',
      startTime,
      endTime,
    },
    // 一天前
    {
      key: 'dayBeforeDate',
      startTime: startTime.subtract(1, 'day'),
      endTime: endTime.subtract(1, 'day'),
    },
    // 一周前
    {
      key: 'weekBeforeDate',
      startTime: startTime.subtract(1, 'week'),
      endTime: endTime.subtract(1, 'week'),
    },
  ]

  const list = await Promise.all(
    timeList.map((time) => getHistogram({ ...time, projectCode, projectEnv }))
  )

  const result = list.map(({ histogram }, index) => ({
    key: timeList[index].key,
    date: dayjs(timeList[index].startTime).format('YYYY-MM-DD'),
    data: histogram.buckets.map(
      ({ key_as_string, doc_count, uv }: Record<string, any>) => ({
        key: key_as_string,
        pv: doc_count,
        uv: uv.value,
      })
    ),
  }))

  return new ApiData(0, '获取流量数据成功', result)
}
