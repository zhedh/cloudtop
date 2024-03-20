import { EChartsOption } from 'echarts'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import Chart from '../../../../components/Chart'
import { ChartRecord } from '../../../../types'
import { COLORS } from '../../../../constants/chart'

interface Props {
  title: string
  colors?: string[]
  data: ChartRecord[]
}

function PieChart(props: Props) {
  const [option, setOption] = useState<EChartsOption>()

  useEffect(() => {
    updateChart(props.data)
  }, [props.data])

  const updateChart = (data: ChartRecord[] = []) => {
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
          name: '网络占比',
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
          data: data.map((i) => ({ name: i.key, value: i.value })),
        },
      ],
    }

    setOption(option)
  }

  return (
    <Wrapper>
      <h3>{props.title}</h3>
      <Chart option={option} height={400} />
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
`

export default PieChart
