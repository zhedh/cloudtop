import { DatePicker } from 'antd'
import dayjs, { Dayjs } from 'dayjs'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import PerformanceStat from './PerformanceStat'
import PieChart from './PieChart'
import TopList, { PerformanceTopRecord } from './TopList'
import {
  performanceApiChart,
  performanceApiStat,
  performanceApiTopList,
  performancePageNetworkChart,
  performancePageStat,
  performancePageTopList,
} from '../../../../services/dashboard'
import { ChartRecord, StatParams } from '../../../../types'
import { StatRecord } from '../types'

const PAGE_OPTIONS: StatRecord[] = [
  {
    title: 'TTFB平均时间',
    type: 'ttfb',
    desc: '网络请求耗时，等待接收响应的第一个字节所花费的时间。',
    // value: 276.34,
    unit: 'ms',
  },
  {
    title: 'DOMContentLoaded平均时间',
    desc: 'HTML加载完成时间，即DOM Ready时间。',
    type: 'ready',
    // value: 888.88,
    unit: 'ms',
  },
  {
    title: 'LOAD平均时间',
    desc: '加载完成平均时间，从开始请求到完全加载的时间。',
    type: 'load',
    // value: 2034.23,
    unit: 'ms',
  },
  {
    title: 'LCP平均时间',
    desc: '最大内容绘制时间',
    type: 'lcp',
    // value: 2034.23,
    unit: 'ms',
  },
]

const API_OPTIONS: StatRecord[] = [
  {
    title: '接口请求总量',
    type: 'count',
    desc: '',
  },
  {
    title: '接口请求平均耗时',
    desc: '',
    type: 'time',
    unit: 'ms',
  },
  {
    title: '接口请求成功率',
    desc: '请求成功数 / 请求总数。',
    type: 'successRatio',
    unit: '%',
  },
]

const formatApiChartKey = (key: string) => {
  const [a, b] = key.split('-')
  if (a === '*') {
    return '<' + (+b / 1000).toFixed(0) + '秒'
  }

  if (b === '*') {
    return '>' + (+a / 1000).toFixed(0) + '秒'
  }

  return (+a / 1000).toFixed(0) + '-' + (+b / 1000).toFixed(0) + '秒'
}

const Performance: React.FC = () => {
  const [date, setDate] = useState<Dayjs | null>()
  const [pageStat, setPageStat] = useState<StatRecord[]>([])
  const [apiStat, setApiStat] = useState<StatRecord[]>([])
  const [networkData, setNetworkData] = useState<ChartRecord[]>([])
  const [apiData, setApiData] = useState<ChartRecord[]>([])
  const [pageTops, setPageTops] = useState<PerformanceTopRecord[]>([])
  const [apiTops, setApiTops] = useState<PerformanceTopRecord[]>([])

  useEffect(() => {
    const query = {
      startTime: dayjs(date).startOf('date').format('YYYY-MM-DD HH:mm:ss'),
      endTime: dayjs(date).endOf('date').format('YYYY-MM-DD HH:mm:ss'),
    }

    getPageStat(query)
    getApiStat(query)
    getNetworkChart(query)
    getApiChart(query)
    getPageTopList(query)
    getApiTopList(query)
  }, [date])

  const getPageStat = async (query: StatParams) => {
    const { result } = await performancePageStat(query)
    setPageStat(
      PAGE_OPTIONS.map((o) => ({
        ...o,
        value: (result as unknown as Record<string, number>)[o.type]?.toFixed(
          2
        ),
      }))
    )
  }

  const getNetworkChart = async (query: StatParams) => {
    const { result } = await performancePageNetworkChart(query)
    setNetworkData(result)
  }

  const getApiStat = async (query: StatParams) => {
    const { result } = await performanceApiStat(query)
    result.successRatio = result.successRatio * 100
    result.time = +result.time?.toFixed(2)
    result.successRatio = +result.successRatio.toFixed(2)

    setApiStat(
      API_OPTIONS.map((o) => ({
        ...o,
        value: (result as unknown as Record<string, number>)[o.type],
      }))
    )
  }

  const getApiChart = async (query: StatParams) => {
    const { result } = await performanceApiChart(query)
    setApiData(result.map((i) => ({ ...i, key: formatApiChartKey(i.key) })))
  }

  const getPageTopList = async (query: StatParams) => {
    const { result } = await performancePageTopList(query)
    setPageTops(
      result.map((i) => ({ key: i.page, count: i.count, time: i.load.avg }))
    )
  }

  const getApiTopList = async (query: StatParams) => {
    const { result } = await performanceApiTopList(query)
    setApiTops(
      result.map((i) => ({ key: i.api, count: i.count, time: i.time.avg }))
    )
  }

  return (
    <Wrapper>
      <h2>
        <span>页面性能</span>
        <DatePicker
          value={date}
          disabledDate={(date) => date > dayjs()}
          onChange={(date) => setDate(date)}
          allowClear
          placeholder="今天"
        />
      </h2>
      <PerformanceStat statData={pageStat} />
      <SectionWrapper>
        <PieChart title="网络类型占比" data={networkData} />
        <TopList
          title="页面加载耗时路由Top10"
          headers={['页面路由', '数量', '平均耗时']}
          data={pageTops}
        />
      </SectionWrapper>
      <h2>
        <span>接口性能</span>
      </h2>
      <PerformanceStat statData={apiStat} />
      <SectionWrapper>
        <PieChart title="接口请求耗时分段数量占比" data={apiData} />
        <TopList
          title="接口请求耗时Top10"
          headers={['接口', '数量', '平均耗时']}
          data={apiTops}
        />
      </SectionWrapper>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  padding-top: 10px;

  h2 {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0;
    padding: var(--padding);
    font-size: 18px;
  }
`

const SectionWrapper = styled.section`
  display: grid;
  grid-template-columns: 2fr 3fr;
  grid-column-gap: var(--padding);
  margin: var(--margin);
`

export default Performance
