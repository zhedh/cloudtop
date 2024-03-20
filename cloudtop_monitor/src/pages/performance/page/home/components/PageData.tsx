import React, { useEffect, useState } from 'react'
import { DatePicker, Radio, RadioChangeEvent } from 'antd'
import styled from 'styled-components'
import dayjs, { Dayjs } from 'dayjs'
import Card from '../../../../../components/Card'
import { PAGE_PERF_DATA_LIST, TIME_INTERVALS } from '../constant'
import { TimeInterval } from '../types'
import {
  PerformancePageDataRecord,
  performancePageData,
} from '../../../../../services/performance'
import { EChartsOption } from 'echarts'
import Chart from '../../../../../components/Chart'
import { COLORS } from '../../../../../constants/chart'
const { RangePicker } = DatePicker

interface Props {
  date: Dayjs
}

function PageData(props: Props) {
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
    props.date,
    props.date,
  ])
  const [timeIntervalOptions, setIimeIntervalOptions] = useState(TIME_INTERVALS)
  const [timeInterval, setTimeInterval] = useState(TimeInterval.MINUTE)
  const [option, setOption] = useState<EChartsOption>()

  useEffect(() => {
    const dateRange = [props.date, props.date] as [Dayjs, Dayjs]
    setDateRange(dateRange)
    setTimeInterval(TimeInterval.MINUTE)
    getData({ dateRange, timeInterval: TimeInterval.MINUTE })
  }, [props.date])

  const getData = async (query: {
    dateRange: [Dayjs, Dayjs]
    timeInterval: TimeInterval
  }) => {
    const [startDate, endDate] = query.dateRange
    const { result } = await performancePageData({
      startTime: dayjs(startDate).startOf('day').toISOString(),
      endTime: dayjs(endDate).endOf('day').toISOString(),
      timeInterval: query.timeInterval,
    })

    updateOption(result)
  }

  const updateOption = (records: PerformancePageDataRecord[]) => {
    const categories: string[] = []

    const map: Record<string, number[]> = {
      count: [],
      dns: [],
      ready: [],
      load: [],
      lcp: [],
      tcp: [],
      ssl: [],
      ttfb: [],
      trans: [],
      dom: [],
      res: [],
    }

    records.forEach((record) => {
      categories.push(dayjs(record.key).format('MM-DD\nHH:mm'))
      map.count.push(record.count)
      map.dns.push(record.dns || 0)
      map.ready.push(record.ready || 0)
      map.load.push(record.load || 0)
      map.lcp.push(record.lcp || 0)
      map.tcp.push(record.tcp || 0)
      map.ssl.push(record.ssl || 0)
      map.ttfb.push(record.ttfb || 0)
      map.trans.push(record.trans || 0)
      map.dom.push(record.dom || 0)
      map.res.push(record.res || 0)
    })

    const series = PAGE_PERF_DATA_LIST.map((r) => {
      return {
        name: r.name,
        type: 'line',
        yAxisIndex: 1,
        smooth: true,
        symbol: 'none',
        large: true,
        data: map[r.key].map((i) => i?.toFixed(2)),
      }
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
        bottom: 90,
      },

      legend: {
        selected: {
          TCP连接: false,
          SSl建连: false,
          请求响应: false,
          内容传输: false,
          DOM解析: false,
          资源加载: false,
        },
        data: ['采样数', ...PAGE_PERF_DATA_LIST.map((i) => i.name)],
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
          name: '采样数',
          position: 'left',
          alignTicks: true,
        },
        {
          type: 'value',
          name: '耗时',
          position: 'right',
          alignTicks: true,
        },
      ],
      series: [
        {
          name: '采样数',
          type: 'bar',
          data: map.count,
        },
        ...(series as []),
      ],
    }

    setOption(option)
  }

  const handleDateRangeChange = (dateRange: [Dayjs, Dayjs]) => {
    const [startDate, endDate] = dateRange
    const diff = endDate.diff(startDate, 'day')
    let newTimeInterval = timeInterval

    if (diff > 1) {
      newTimeInterval = TimeInterval.HOUR
      setIimeIntervalOptions(
        TIME_INTERVALS.map((i, index) => ({ ...i, disabled: index < 1 }))
      )
    }

    if (diff >= 7) {
      newTimeInterval = TimeInterval.DAY
      setIimeIntervalOptions(
        TIME_INTERVALS.map((i, index) => ({ ...i, disabled: index < 2 }))
      )
    }

    setTimeInterval(newTimeInterval)
    setDateRange(dateRange)
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

export default React.memo(PageData)
