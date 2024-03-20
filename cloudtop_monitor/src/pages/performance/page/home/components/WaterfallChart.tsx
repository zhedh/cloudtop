import React, { useEffect, useState } from 'react'
import Chart from '../../../../../components/Chart'
import { EChartsOption } from 'echarts'
import { ChartRecord } from '../../../../../types'

interface Props {
  data: ChartRecord[]
}

function WaterfallChart(props: Props) {
  const [option, setOption] = useState<EChartsOption>()

  useEffect(() => {
    const values: number[] = []
    const placeholderValues: number[] = [0]
    let prev = 0
    let firstbyte = 0
    let ready = 0
    let load = 0

    props.data.forEach((i, index) => {
      values.push(i.value)
      placeholderValues.push(i.value + prev)
      prev = i.value + prev

      if (index === 3) {
        firstbyte = prev
      }
      if (index === 5) {
        ready = prev
      }
      if (index === 6) {
        load = prev
      }
    })

    const option: EChartsOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        formatter(params) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          const tar = params[1] as CallbackDataParams
          return tar.name + '<br/>' + tar.seriesName + ' : ' + tar.value
        },
      },

      grid: {
        top: '10%',
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'value',
        axisLabel: {
          formatter: (value) => value?.toFixed(2),
        },
      },
      yAxis: {
        type: 'category',
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        data: [
          'DNS查询',
          'TCP连接',
          'SSl建连',
          '请求响应',
          '内容传输',
          'DOM解析',
          '资源加载',
        ],
      },
      series: [
        {
          name: '占位',
          type: 'bar',
          stack: 'Total',
          silent: true,
          itemStyle: {
            borderColor: 'transparent',
            color: 'transparent',
          },
          emphasis: {
            itemStyle: {
              borderColor: 'transparent',
              color: 'transparent',
            },
          },
          data: placeholderValues,
        },
        {
          name: '耗时',
          type: 'bar',
          stack: 'Total',
          // label: {
          //   show: true,
          //   position: 'top',
          // },
          data: values.map((i) => i?.toFixed(2)),
          colorBy: 'data',
          markLine: {
            symbol: ['none', 'none'],
            lineStyle: {
              type: 'dashed', //线条样式
              color: '#999',
            },
            label: {
              show: true,
              position: 'end', // 文字显示的位置
              formatter(option) {
                return option.name
              },
            },
            data: [
              {
                name: '首字节',
                type: 'average',
                valueDim: 'close',
                xAxis: firstbyte, // 标记线x轴的值
              },
              {
                name: 'DOM Ready',
                type: 'average',
                valueDim: 'close',
                xAxis: ready, // 第二条标记线x轴的值
              },
              {
                name: '页面完全加载',
                type: 'average',
                valueDim: 'close',
                xAxis: load, // 第二条标记线x轴的值
              },
            ],
          },
        },
      ],
    }

    setOption(option)
  }, [props.data])

  return <Chart option={option} height={300} />
}

export default React.memo(WaterfallChart)
