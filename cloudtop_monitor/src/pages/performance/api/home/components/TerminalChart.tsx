import { EChartsOption } from 'echarts'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import React from 'react'
import { COLORS } from '../../../../../constants/chart'
import Chart from '../../../../../components/Chart'
import {
  PerformanceApiTerminalRecord,
  PerformanceApiTimeRecord,
} from '../../../../../services/performance'

interface Props {
  title: string
  colors?: string[]
  data: PerformanceApiTerminalRecord[]
}

function RatioChart(props: Props) {
  const [pieOption, setPieOption] = useState<EChartsOption>()
  const [barOption, setBarOption] = useState<EChartsOption>()

  useEffect(() => {
    updatePieChart(props.data)
    updateBarChart(props.data)
  }, [props.data])

  const toNumber = (value: any, fixed = 0) => {
    if (isNaN(value)) return value
    return (+value)?.toFixed(fixed)
  }

  const formatTimeKey = (key: string) => {
    const [s, e] = key.split('-')
    return toNumber(s) + '-' + toNumber(e) + ' ms'
  }

  const updatePieChart = (data: PerformanceApiTerminalRecord[]) => {
    const option: EChartsOption = {
      color: props.colors ?? COLORS,
      grid: {
        left: '10%',
        right: '4%',
        bottom: '10%',
        top: 0,
        containLabel: true,
      },
      tooltip: {
        trigger: 'item',
      },
      legend: {
        bottom: 20,
        left: 'center',
      },
      series: [
        {
          type: 'pie',
          radius: ['30%', '55%'],
          label: {
            show: true,
            formatter(param) {
              return param.name + ' (' + param.percent + '%)'
            },
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 18,
              fontWeight: 'bold',
            },
          },
          data: data.map((i) => ({ name: i.key, value: i.count })),
        },
      ],
    }

    setPieOption(option)
  }

  const updateBarChart = (data: PerformanceApiTerminalRecord[]) => {
    const categories: string[] = []
    const map: Record<string, number[]> = {}

    data.forEach((record) => {
      categories.push(record.key)
      record.times.forEach((time: PerformanceApiTimeRecord) => {
        map[time.key] = [...(map[time.key] || []), time.count]
      })
    })

    const option: EChartsOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      grid: {
        left: '3%',
        right: '10%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'value',
        show: false,
      },
      yAxis: {
        type: 'category',
        data: categories,
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
      },
      series: Object.keys(map).map((key) => {
        return {
          name: formatTimeKey(key),
          type: 'bar',
          stack: 'total',
          barMaxWidth: 50,
          data: map[key],
        }
      }),
    }

    setBarOption(option)
  }

  return (
    <Wrapper>
      <h3>{props.title}</h3>
      <div>
        <Chart option={pieOption} height={320} />
        <Chart option={barOption} height={320} />
      </div>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  border-radius: var(--border-radius);
  background-color: var(--light-color);

  > h3 {
    margin: 0;
    padding: var(--padding) var(--padding) 0;
    font-size: 16px;
  }

  > div {
    display: flex;
  }
`

export default React.memo(RatioChart)
