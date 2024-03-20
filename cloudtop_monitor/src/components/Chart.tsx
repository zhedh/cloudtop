import React, { useEffect, useId, useLayoutEffect, useRef } from 'react'
import * as echarts from 'echarts/core'
import {
  GridComponent,
  LegendComponent,
  TooltipComponent,
  ToolboxComponent,
  TitleComponent,
  MarkLineComponent,
  VisualMapComponent,
  DataZoomComponent,
} from 'echarts/components'
import { LineChart, BarChart, PieChart, MapChart } from 'echarts/charts'
import { UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import styled from 'styled-components'
import { EChartsOption } from 'echarts'

echarts.use([
  CanvasRenderer,
  UniversalTransition,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  LineChart,
  BarChart,
  ToolboxComponent,
  TitleComponent,
  PieChart,
  MarkLineComponent,
  MapChart,
  VisualMapComponent,
  DataZoomComponent,
])

interface ClickEvent {
  name: string
  value: number
}

interface Props {
  option?: EChartsOption
  chartId?: string
  className?: string
  width?: number | string
  height?: number | string
  onSeriesClick?: (e: ClickEvent) => void
  onXAxisClick?: (e: ClickEvent) => void
}

const ChartComponent: React.FC<Props> = (props) => {
  const defaultId = useId()
  const chart = useRef<echarts.ECharts>()
  const id = props.chartId ?? defaultId

  const width =
    typeof props.width === 'number' ? props.width + 'px' : props.width
  const height =
    typeof props.height === 'number' ? props.height + 'px' : props.height

  const changeChart = () => {
    if (chart.current) {
      chart.current.setOption(props.option!)
      return
    }

    const chartDom = document.getElementById(id)!
    chart.current = echarts.init(chartDom)
    chart.current.setOption(props.option!)

    chart.current.on('click', 'series', (e) => {
      props?.onSeriesClick && props.onSeriesClick(e as ClickEvent)
    })
  }

  const resize = () => {
    chart.current && chart.current.resize()
  }

  useLayoutEffect(() => {
    if (!props.option) return
    changeChart()
  }, [props.option])

  useEffect(() => {
    window.addEventListener('resize', resize, false)

    return () => {
      window.removeEventListener('resize', resize, false)
      chart.current && chart.current.dispose()
    }
  }, [])

  return (
    <Container
      id={id}
      className={props.className}
      width={width}
      height={height}
    />
  )
}

interface ContainerProps {
  width?: string
  height?: string
}
const Container = styled.div<ContainerProps>`
  width: ${(props) => props.width || '100%'};
  height: ${(props) => props.height || '100%'};
`

const Chart = React.memo(ChartComponent)
export default Chart
