import { EChartsOption } from 'echarts'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import React from 'react'
import { COLORS } from '../../../../../constants/chart'
import Chart from '../../../../../components/Chart'
import { PerformancePageRadioData } from '../../../../../services/performance'
import { PAGE_PERF_LIST } from '../constant'

interface Props {
  title: string
  colors?: string[]
  data: PerformancePageRadioData
}

function RatioChart(props: Props) {
  const [pieOption, setPieOption] = useState<EChartsOption>()
  const [barOption, setBarOption] = useState<EChartsOption>()

  useEffect(() => {
    updatePieChart(props.data)
    updateBarChart(props.data)
  }, [props.data])

  const updatePieChart = (data: PerformancePageRadioData) => {
    const { records } = data
    const option: EChartsOption = {
      color: props.colors ?? COLORS,
      grid: {
        left: '3%',
        right: '4%',
        bottom: '10%',
        top: '0',
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
          // name: '网络占比',
          type: 'pie',
          radius: ['30%', '60%'],
          // avoidLabelOverlap: false,
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
          data: records.map((i) => ({ name: i.key, value: i.count })),
        },
      ],
    }

    setPieOption(option)
  }

  const updateBarChart = (data: PerformancePageRadioData) => {
    const { records } = data
    const categories: string[] = []
    const map: Record<string, number[]> = {
      dns: [],
      tcp: [],
      ssl: [],
      ttfb: [],
      trans: [],
      dom: [],
      res: [],
    }

    records.forEach((record) => {
      categories.push(record.key)
      map.dns.push(record.dns)
      map.tcp.push(record.tcp)
      map.ssl.push(record.ssl)
      map.ttfb.push(record.ttfb)
      map.trans.push(record.trans)
      map.dom.push(record.dom)
      map.res.push(record.res)
    })

    const series = PAGE_PERF_LIST.map((r) => {
      return {
        name: r.name,
        type: 'bar',
        stack: 'total',
        barMaxWidth: 50,
        // label: {
        //   show: true,
        // },
        // emphasis: {
        //   focus: 'series',
        // },
        data: map[r.key].map((i) => i?.toFixed(2)),
      }
    })

    console.log('series: ', series)

    const option: EChartsOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      // legend: {
      //   bottom: 20,
      // },
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
      series: series as [],
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
