import styled from 'styled-components'
import Chart from '../../../../components/Chart'
import { useEffect, useState } from 'react'
import { EChartsOption } from 'echarts'
import { COLORS } from '../../../../constants/chart'
import { HealthChartRecord, healthChart } from '../../../../services/dashboard'
import dayjs, { Dayjs } from 'dayjs'
import { HEALTH_CHART_OPTIONS } from '../constant'
import { ArrowRightOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const TIME_LABEL_MAP = {
  currentDate: '当前时间',
  dayBeforeDate: '一天前',
  weekBeforeDate: '一周前',
}

interface Props {
  date: Dayjs
  record: (typeof HEALTH_CHART_OPTIONS)[0]
}

function AnomalyTrend({ date, record }: Props) {
  const navigate = useNavigate()
  const [option, setOption] = useState<EChartsOption>()

  useEffect(() => {
    getData()
  }, [date])

  const getData = async () => {
    const { result } = await healthChart({
      startTime: dayjs(date).startOf('date').format('YYYY-MM-DD HH:mm:ss'),
      endTime: dayjs(date).endOf('date').format('YYYY-MM-DD HH:mm:ss'),
      type: record.value,
    })

    updateChart(result)
  }

  const updateChart = (records: HealthChartRecord[]) => {
    const xData =
      records[0]?.data.map((i) => dayjs(i.key).format('YYYY.MM.DD HH:mm')) || []

    const option: EChartsOption = {
      color: COLORS,
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '10%',
        containLabel: true,
      },
      tooltip: {
        trigger: 'axis',
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
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
      series: records.map((i) => ({
        data: i.data.map((i) => i.value),
        name: TIME_LABEL_MAP[i.key],
        type: 'line',
        areaStyle: {},
        smooth: true,
        symbol: 'none',
      })),
    }

    setOption(option)
  }

  return (
    <Wrapper>
      <h3 onClick={() => navigate(record.path)}>
        {record.label}趋势
        <ArrowRightOutlined />
        {/* <RightOutlined /> */}
        <small>{date?.format('YYYY-MM-DD')}</small>
      </h3>
      <Chart option={option} height={300} />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  padding: var(--padding);
  border-radius: var(--border-radius);
  background-color: var(--light-color);

  > h3 {
    margin: 0;
    cursor: pointer;

    svg {
      margin-left: 5px;
      color: var(--text-secondary-color);
    }

    small {
      margin-top: 5px;
      display: block;
      font-weight: normal;
      color: var(--text-tertiary-color);
    }
  }
`

export default AnomalyTrend
