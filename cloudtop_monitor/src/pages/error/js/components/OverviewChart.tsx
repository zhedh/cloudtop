import { useEffect, useState } from 'react'
import dayjs, { Dayjs } from 'dayjs'
import { JsErrorOverviewRecord } from '../../../../services/error'
import Chart from '../../../../components/Chart'
import { EChartsOption } from 'echarts'
import { WARNING_COLORS } from '../../../../constants/chart'

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
        // formatter: ([{ value }]: any) => (+value / 1000000).toFixed(2) + '万元',
      },
      // grid: {
      //   right: '20%',
      // },

      legend: {
        data: ['JS错误', 'JS错误率'],
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
          name: 'JS错误',
          position: 'left',
          alignTicks: true,
          axisLine: {
            // show: true,
            lineStyle: {
              color: colors[0],
            },
          },
        },
        {
          type: 'value',
          name: 'JS错误率',
          position: 'right',
          alignTicks: true,
          axisLine: {
            lineStyle: {
              color: colors[1],
            },
          },
          axisLabel: {
            formatter: (value) => (value * 100).toFixed(2) + '%',
          },
        },
      ],
      series: [
        {
          name: 'JS错误',
          type: 'bar',
          data: errorData,
        },
        {
          name: 'JS错误率',
          type: 'line',
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
    />
  )
}

export default OverviewChart
