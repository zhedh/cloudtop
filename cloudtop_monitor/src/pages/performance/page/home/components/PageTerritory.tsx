import styled from 'styled-components'
import { useEffect, useState } from 'react'
import { Dayjs } from 'dayjs'
import axios from 'axios'
import React from 'react'
import * as echarts from 'echarts/core'
import { EChartsOption } from 'echarts'
import Card from '../../../../../components/Card'
import Chart from '../../../../../components/Chart'
import TerritoryList from './TerritoryList'
import {
  PerformancePageTerritoryRecord,
  performancePageTerritory,
} from '../../../../../services/performance'

interface Props {
  startTime: Dayjs
  endTime: Dayjs
}

const PageTerritory = (props: Props) => {
  const { startTime, endTime } = props
  const [jsonLoad, setJsonLoad] = useState(false)
  const [option, setOption] = useState<EChartsOption>()
  const [territoryData, setTerritoryData] = useState<
    PerformancePageTerritoryRecord[]
  >([])

  useEffect(() => {
    getMapData()
  }, [startTime, endTime])

  const getCnJson = async () => {
    if (jsonLoad) return
    const { data } = await axios.get('/china.json')
    echarts.registerMap('TIME_CN', data)
    setJsonLoad(true)
  }

  const getMapData = async () => {
    await getCnJson()
    const { result } = await performancePageTerritory({
      startTime: startTime.format('YYYY-MM-DD HH:mm:ss'),
      endTime: endTime.format('YYYY-MM-DD HH:mm:ss'),
    })
    setTerritoryData(result)
    loadMap(result.map((i) => ({ value: +i.load?.toFixed(2), name: i.key })))
  }

  const loadMap = async (data: { name: string; value: number }[]) => {
    const max = Math.max(...data.map((i) => i.value), 0)

    const option: EChartsOption = {
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
          name: '地域加载耗时分布图',
          type: 'map',
          roam: true,
          map: 'TIME_CN',
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
      <article>
        <div>
          <h3>地域加载耗时分布图</h3>
          <Chart option={option} height={500} />
        </div>
        <TerritoryList title="访问用户区域分布排行" data={territoryData} />
      </article>
    </Wrapper>
  )
}

const Wrapper = styled(Card)`
  margin: var(--margin);
  padding: 0;

  > article {
    display: grid;
    grid-template-columns: 3fr 2fr;
    grid-column-gap: var(--padding);

    h3 {
      padding: 0 var(--padding);
    }
  }
`

export default React.memo(PageTerritory)
