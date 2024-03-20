import React, { useEffect, useState } from 'react'
import Chart from '../../../../../components/Chart'
import { EChartsOption } from 'echarts'
import { ChartRecord } from '../../../../../types'
import { COLORS } from '../../../../../constants/chart'

interface Props {
  interval: number
  data: ChartRecord[]
}

function WaterfallChart(props: Props) {
  const [option, setOption] = useState<EChartsOption>()

  useEffect(() => {
    const values: number[] = []
    const categories: string[] = []

    props.data.forEach((i) => {
      values.push(i.value)
      categories.push(i.key)
    })

    const option: EChartsOption = {
      color: COLORS,
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        formatter(params) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          const tar = params[0] as CallbackDataParams
          const name = `${tar.name}-${+tar.name + props.interval}ms`
          const value = `${tar.marker}${tar.seriesName}  <b>${tar.value}</b>`
          return `${name}<br/>${value}`
        },
      },
      grid: {
        top: '10%',
        left: '3%',
        right: '10%',
        bottom: 70,
        containLabel: true,
      },
      dataZoom: [
        {
          type: 'inside',
          startValue: 0,
          endValue: 200,
        },
        {
          type: 'slider',
        },
      ],
      xAxis: {
        name: '耗时(ms)',
        type: 'category',
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        data: categories,
      },
      yAxis: {
        name: '请求次数',
        type: 'value',
      },
      series: [
        {
          name: '请求次数',
          type: 'bar',
          data: values,
        },
        // {
        //   name: '耗时',
        //   type: 'line',
        //   // label: {
        //   //   show: true,
        //   //   position: 'top',
        //   // },
        //   color: COLORS[1],
        //   data: values.map((i) => i?.toFixed(2)),
        // },
      ],
    }

    setOption(option)
  }, [props.data])

  return <Chart option={option} height={300} />
}

export default React.memo(WaterfallChart)
