import Chart from '../../../../../components/Chart'
import { JsErrorOverviewRecord } from '../../../../../services/error'
import { useEffect, useState } from 'react'
import dayjs, { Dayjs } from 'dayjs'
import { WARNING_COLORS } from '../../../../../constants/chart'
import { EChartsOption } from 'echarts'

const OverviewChart = (props: {
  data: JsErrorOverviewRecord[]
  onChangeDate?: (date: Dayjs) => void
}) => {
  const [option, setOption] = useState<EChartsOption>()
  const colors = WARNING_COLORS

  useEffect(() => {
    const xData: string[] = []
    const errorData: number[] = []
    const errorRadioData: number[] = []

    props.data.forEach((i) => {
      xData.push(i.key)
      errorData.push(i.error)
      errorRadioData.push(i.errorRadio)
    })

    const option: EChartsOption = {
      color: colors,
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
        },
      },
      legend: {
        data: ['发生次数', '接口错误率'],
      },
      xAxis: [
        {
          type: 'category',
          axisTick: {
            alignWithLabel: true,
            show: false,
          },
          data: xData,
          axisLabel: {
            formatter: (value) => dayjs(value).format('MM-DD'),
          },
          axisLine: {
            show: false,
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          name: '发生次数',
          position: 'left',
          alignTicks: true,
          axisLine: {
            lineStyle: {
              color: '#aaa',
            },
          },
        },
        {
          type: 'value',
          name: '接口错误率',
          position: 'right',
          alignTicks: true,
          axisLine: {
            lineStyle: {
              color: '#aaa',
            },
          },
          axisLabel: {
            formatter: (value) => (value * 100).toFixed(2) + '%',
          },
        },
      ],
      series: [
        {
          name: '发生次数',
          type: 'bar',
          data: errorData,
        },
        {
          name: '接口错误率',
          type: 'line',
          smooth: true,
          symbol: 'none',
          yAxisIndex: 1,
          data: errorRadioData,
          tooltip: {
            valueFormatter(value) {
              return (+(value || 0) * 100).toFixed(2) + '%'
            },
          },
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
      onXAxisClick={({ name }) =>
        props.onChangeDate && props.onChangeDate(dayjs(name))
      }
    />
  )
}

export default OverviewChart
