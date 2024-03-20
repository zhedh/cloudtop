import React, { useEffect, useState } from 'react'
import { DatePicker, Radio, RadioChangeEvent } from 'antd'
import styled from 'styled-components'
import dayjs, { Dayjs } from 'dayjs'
import Card from '../../../../../components/Card'
import { API_PERF_DATA_LIST, TIME_INTERVALS } from '../constant'
import { TimeInterval } from '../types'
import {
  PerformanceApiDataRecord,
  performanceApiData,
} from '../../../../../services/performance'
import { EChartsOption } from 'echarts'
import Chart from '../../../../../components/Chart'
import { COLORS } from '../../../../../constants/chart'
import { formatElapsedTime, formatPercent } from '../../../../../utils/format'
const { RangePicker } = DatePicker

interface Props {
  date: Dayjs
}

function ApiData(props: Props) {
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
    props.date,
    props.date,
  ])
  const [timeIntervalOptions, setIimeIntervalOptions] = useState(TIME_INTERVALS)
  const [timeInterval, setTimeInterval] = useState(TimeInterval.HOUR)
  const [option, setOption] = useState<EChartsOption>()

  useEffect(() => {
    const dateRange = [props.date, props.date] as [Dayjs, Dayjs]
    setDateRange(dateRange)
    setTimeInterval(TimeInterval.HOUR)
    getData({ dateRange, timeInterval: TimeInterval.HOUR })
  }, [props.date])

  const getData = async (query: {
    dateRange: [Dayjs, Dayjs]
    timeInterval: TimeInterval
  }) => {
    const [startDate, endDate] = query.dateRange
    const { result } = await performanceApiData({
      startTime: dayjs(startDate).startOf('day').toISOString(),
      endTime: dayjs(endDate).endOf('day').toISOString(),
      timeInterval: query.timeInterval,
    })

    updateOption(result)
  }

  const updateOption = (records: PerformanceApiDataRecord[]) => {
    const categories: string[] = []

    const map: Record<string, number[]> = {
      count: [],
      successCount: [],
      errorCount: [],
      slowCount: [],
      time: [],
      successRatio: [],
      slowRatio: [],
    }

    records.forEach((record) => {
      categories.push(dayjs(record.key).format('MM-DD\nHH:mm'))
      map.count.push(record.count)
      map.successCount.push(record.successCount || 0)
      map.errorCount.push(record.count - record.successCount || 0)
      map.slowCount.push(record.slowCount || 0)
      map.time.push(record.time || 0)
      map.successRatio.push(record.successRatio || 0)
      map.slowRatio.push(record.slowRatio || 0)
    })

    const series = API_PERF_DATA_LIST.map((r) => {
      const item: Record<string, any> = {
        ...r,
        large: true,
        data: map[r.key].map((i) => i?.toFixed(2)),
        // tooltip: {
        //   valueFormatter(value: number) {
        //     return value
        //   },
        // },
      }

      if (r.type === 'line') {
        item.yAxisIndex = 2
        item.smooth = true
        item.symbol = 'none'
        item.lineStyle = {
          width: 2,
          type: 'dashed',
        }
        item.tooltip = {
          valueFormatter(value: number) {
            return formatPercent(+value) + '%'
          },
        }
      }

      if (r.key === 'time') {
        item.yAxisIndex = 1
        item.lineStyle = {
          width: 2,
          type: 'solid',
        }
        item.tooltip = {
          valueFormatter(value: number) {
            return formatElapsedTime(+value || 0)
          },
        }
      }

      return item
    })

    const option: EChartsOption = {
      color: COLORS,
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
        },
      },
      grid: {
        top: 90,
        right: '4%',
        bottom: 90,
        left: '3%',
        containLabel: true,
      },
      legend: {
        selected: {
          成功次数: false,
          错误次数: false,
          缓慢次数: false,
        },
        data: API_PERF_DATA_LIST.map((i) => i.name),
      },
      dataZoom: [
        {
          type: 'inside',
          startValue: records.length - 31,
          endValue: records.length - 1,
        },
        {
          type: 'slider',
        },
      ],
      xAxis: [
        {
          type: 'category',
          axisTick: {
            alignWithLabel: true,
          },
          silent: false,
          splitLine: {
            show: false,
          },
          splitArea: {
            show: false,
          },
          data: categories,
          axisLabel: {
            interval: 'auto',
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          name: '请求量',
          position: 'left',
          alignTicks: true,
        },
        {
          type: 'value',
          name: '耗时',
          position: 'right',
          alignTicks: true,
          axisLabel: {
            show: true,
            formatter(value: number) {
              return formatElapsedTime(value)
            },
          },
        },
        {
          type: 'value',
          name: '比率',
          position: 'right',
          offset: 70,
          min: 0,
          max: 1,
          axisLabel: {
            show: true,
            formatter(value: number) {
              return formatPercent(value) + '%'
            },
          },
        },
      ],
      series: series as [],
    }

    setOption(option)
  }

  const handleDateRangeChange = (dateRange: [Dayjs, Dayjs]) => {
    const [startDate, endDate] = dateRange
    const diff = endDate.diff(startDate, 'day')
    let newTimeInterval = timeInterval

    setDateRange(dateRange)
    if (diff > 1) {
      newTimeInterval = TimeInterval.HOUR
      setIimeIntervalOptions(
        TIME_INTERVALS.map((i, index) => ({ ...i, disabled: index < 1 }))
      )
    }

    if (diff >= 30) {
      newTimeInterval = TimeInterval.DAY
      setIimeIntervalOptions(
        TIME_INTERVALS.map((i, index) => ({ ...i, disabled: index < 2 }))
      )
    }

    setTimeInterval(newTimeInterval)
    getData({ dateRange, timeInterval: newTimeInterval })
  }

  const handleTimeIntervalChange = ({
    target: { value },
  }: RadioChangeEvent) => {
    setTimeInterval(value)
    getData({ dateRange, timeInterval: value })
  }

  return (
    <Wrapper
      title="性能均值"
      actions={
        <>
          <RangePicker
            allowClear={false}
            disabledDate={(date) => date > dayjs()}
            value={dateRange}
            onChange={(value) => handleDateRangeChange(value as [Dayjs, Dayjs])}
          />
          &nbsp;&nbsp;
          <Radio.Group
            optionType="button"
            options={timeIntervalOptions}
            onChange={handleTimeIntervalChange}
            value={timeInterval}
          />
        </>
      }
    >
      <Chart option={option} height={360} />
    </Wrapper>
  )
}

const Wrapper = styled(Card)`
  margin: var(--margin);
`

export default React.memo(ApiData)
