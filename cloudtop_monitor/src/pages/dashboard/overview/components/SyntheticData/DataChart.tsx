import { EChartsOption } from 'echarts'
import { useEffect, useState } from 'react'
import Chart from '../../../../../components/Chart'
import { OverviewSyntheticChartRecord } from '../../../../../services/dashboard'
import { CHART_TYPE_MAP } from '../../constant'

const DataChart = (props: { data: OverviewSyntheticChartRecord }) => {
  const [option, setOption] = useState<EChartsOption>()

  useEffect(() => {
    const { type, records } = props.data
    const colors = ['#8bbb11', '#6184fa', '#faa52d']

    const option: EChartsOption = {
      title: {
        text: CHART_TYPE_MAP[type as keyof typeof CHART_TYPE_MAP] + 'TOP10',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01],
        position: 'top',
      },
      yAxis: {
        type: 'category',
        data: records.map((i) => i.key),
        axisLabel: {
          formatter(value) {
            return value.length > 30 ? value.slice(0, 30) + '...' : value
          },
        },
        inverse: true,
      },
      series: [
        {
          name: '2011',
          type: 'bar',
          data: records.map((i) => i.value),
          color: colors[0],
        },
      ],
    }

    setOption(option)
  }, [props.data])

  return <Chart option={option} height={300}></Chart>
}

export default DataChart
