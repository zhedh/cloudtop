import React from 'react'
import styled from 'styled-components'
import Chart from '../../../../components/Chart'
import { JsErrorChartRecord } from '../../../../services/error'
import dayjs from 'dayjs'
import { EChartsOption } from 'echarts'

const Component = (props: { data: JsErrorChartRecord[] }) => {
  const option: EChartsOption = {
    color: ['#8bbb11', '#ff4d4f'],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        data: props.data.map((i) => dayjs(i.key).format('HH:mm')),
        axisTick: {
          alignWithLabel: true,
        },
      },
    ],
    yAxis: [
      {
        type: 'value',
      },
    ],
    series: [
      {
        name: '错误量',
        type: 'bar',
        barWidth: '60%',
        data: props.data.map((i) => i.value),
      },
    ],
  }

  return (
    <Wrapper>
      <Chart option={option} height={260} />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  margin-bottom: var(--padding);
  /* margin-top: var(--padding);
  padding: 16px var(--padding);
  background-color: var(--light-color);
  border-radius: var(--border-radius); */
`

const ErrorChart = React.memo(Component)
export default ErrorChart
