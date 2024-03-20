import { Card, Radio } from 'antd'
import styled from 'styled-components'
import Chart from '../../../../../components/Chart'
import { EChartsOption } from 'echarts'
import { OverviewCoreChartRecord } from '../../../../../services/dashboard'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { OverviewChartType } from '../../../../../types/dashboard'
import { COLORS } from '../../../../../constants/chart'

interface Props {
  type: OverviewChartType
  records: OverviewCoreChartRecord[]
  onTypeChange: (value: OverviewChartType) => void
}
const PvChart: React.FC<Props> = (props) => {
  const [option, setOption] = useState<EChartsOption>()

  useEffect(() => {
    const map: Record<string, number[]> = {}
    let xData: string[] = []

    props.records.forEach((record) => {
      !xData.length && (xData = record.data.map((i) => i.key))
      map[record.key] = record.data.map((i) => i[props.type])
    })

    const currentDateIndex = xData.findIndex((i) => +dayjs(i) > +dayjs())

    const option: EChartsOption = {
      title: {
        text: '实时访问数据',
      },
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: ['当前时间', '一天前', '一周前'],
        bottom: 0,
      },
      xAxis: {
        type: 'category',
        data: xData,
        axisLabel: {
          formatter(value) {
            return dayjs(value).format('HH:mm')
          },
        },
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: '当前时间',
          type: 'line',
          // stack: 'Total',
          data: map.currentDate?.slice(
            0,
            currentDateIndex === -1 ? map.currentDate.length : currentDateIndex
          ),
          smooth: true,
          symbol: 'none',
          color: COLORS[0],
        },
        {
          name: '一天前',
          type: 'line',
          // stack: 'Total',
          data: map.dayBeforeDate,
          smooth: true,
          symbol: 'none',
          color: COLORS[1],
        },
        {
          name: '一周前',
          type: 'line',
          // stack: 'Total',
          data: map.weekBeforeDate,
          smooth: true,
          symbol: 'none',
          color: COLORS[2],
        },
      ],
    }

    setOption(option)
  }, [props.records, props.type])

  return (
    <Wrapper bordered={false}>
      <aside>
        <Radio.Group
          value={props.type}
          buttonStyle="solid"
          onChange={(e) =>
            props.onTypeChange(e.target.value as OverviewChartType)
          }
        >
          <Radio.Button value="pv">访问页面数</Radio.Button>
          <Radio.Button value="uv">访问人数</Radio.Button>
        </Radio.Group>
      </aside>
      <Chart option={option} height={300} />
    </Wrapper>
  )
}

const Wrapper = styled(Card)`
  position: relative;
  margin-top: var(--padding);

  aside {
    position: absolute;
    right: 20px;
    z-index: 10;
  }
`

export default PvChart
