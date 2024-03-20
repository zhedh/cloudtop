import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import * as echarts from 'echarts/core'
import { EChartsOption } from 'echarts'
import Chart from '../../../../components/Chart'

interface Props {
  title?: string
  data: { name: string; value: number }[]
  mapJson: never
}

function TerritoryChart(props: Props) {
  const [option, setOption] = useState<EChartsOption>()

  useEffect(() => {
    if (!props.mapJson) return
    echarts.registerMap('USER_TERRITORY_CHART', props.mapJson)
  }, [props.mapJson])

  useEffect(() => {
    if (!props.mapJson) return
    loadMap(props.data)
  }, [props.mapJson, props.data])

  const loadMap = async (data: { name: string; value: number }[]) => {
    const title = '用户地域分布图'
    const max = Math.max(...data.map((i) => i.value), 0)

    const option: EChartsOption = {
      title: {
        text: title,
        top: 20,
        left: 20,
      },
      tooltip: {
        trigger: 'item',
        showDelay: 0,
        transitionDuration: 0.2,
      },
      visualMap: {
        right: 20,
        bottom: 20,
        min: 0,
        max: max,
        calculable: true,
        inRange: {
          color: [
            '#313695',
            '#4575b4',
            '#74add1',
            '#abd9e9',
            '#e0f3f8',
            '#ffffbf',
            '#fee090',
            '#fdae61',
            '#f46d43',
            '#d73027',
            '#a50026',
          ],
        },
        text: [`High`, 'Low'],
      },
      series: [
        {
          name: title,
          type: 'map',
          roam: true,
          map: 'USER_TERRITORY_CHART',
          emphasis: {
            label: {
              show: true,
            },
          },
          itemStyle: {
            areaColor: '#f5f5f5',
            borderColor: '#ccc',
          },
          data: data,
        },
      ],
    }
    setOption(option)
  }

  return (
    <Wrapper>
      <Chart option={option} height={750} />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  width: 100%;
  border-radius: var(--border-radius);
  background-color: var(--light-color);
`

export default React.memo(TerritoryChart)
