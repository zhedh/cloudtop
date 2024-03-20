import Chart from '../../../../components/Chart'
import { useEffect, useState } from 'react'
import dayjs, { Dayjs } from 'dayjs'
import { ChartRecord } from '../../../../types'
import { EChartsOption } from 'echarts'

const OverviewChart = (props: {
  data: ChartRecord[]
  onChangeDate?: (date: Dayjs) => void
}) => {
  const [option, setOption] = useState<EChartsOption>()
  const colors = ['#8bbb11', '#ff4d4f']

  useEffect(() => {
    const xData: string[] = []
    const yData: number[] = []

    props.data.forEach((i) => {
      xData.push(i.key)
      yData.push(i.value)
    })

    const option: EChartsOption = {
      color: colors,
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
        },
      },
      xAxis: [
        {
          type: 'category',
          axisTick: {
            alignWithLabel: true,
          },
          data: xData,
          axisLabel: {
            formatter: (value) => dayjs(value).format('MM-DD'),
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          name: '资源错误次数',
          position: 'left',
          alignTicks: true,
          axisLine: {
            lineStyle: {
              color: colors[0],
            },
          },
        },
      ],
      series: [
        {
          name: '资源错误次数',
          type: 'bar',
          data: yData,
        },
      ],
    }
    setOption(option)
  }, [props])

  return (
    <Chart
      option={option}
      height={300}
      onSeriesClick={({ name }) =>
        props.onChangeDate && props.onChangeDate(dayjs(name))
      }
    />
  )
}

export default OverviewChart
