import styled from 'styled-components'
import { useEffect, useState } from 'react'
import dayjs, { Dayjs } from 'dayjs'
import {
  ApiErrorDateStatRecord,
  ApiErrorOverviewRecord,
  ApiErrorTopRecord,
  apiErrorChartOverview,
  apiErrorDateStat,
  apiErrorTopList,
} from '../../../../../services/error'
import DateRangeSelect from '../../../../../components/DateRangeSelect'
import OverviewChart from './OverviewChart'
import DateStat from './DateStat'
import TopList from './TopList'

const ErrorApiHome = () => {
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
    dayjs().subtract(1, 'month').add(1, 'day'),
    dayjs(),
  ])
  const [date, setDate] = useState(dateRange[1])
  const [overviewData, setOverviewData] = useState<ApiErrorOverviewRecord[]>([])
  const [dateStats, setDateStats] = useState<ApiErrorDateStatRecord[]>([])
  const [countTopList, setCountTopList] = useState<ApiErrorTopRecord[]>([])
  const [dateTopList, setDateTopList] = useState<ApiErrorTopRecord[]>([])

  useEffect(() => {
    getOverviewChart()
    setDate(dateRange[1])
  }, [dateRange])

  useEffect(() => {
    getDateStats()
    getTopList('date').then((data) => setDateTopList(data))
    getTopList('count').then((data) => setCountTopList(data))
  }, [date])

  const getOverviewChart = async () => {
    const [startDate, endDate] = dateRange
    const { result } = await apiErrorChartOverview({
      startDate: startDate.format('YYYY-MM-DD'),
      endDate: endDate.format('YYYY-MM-DD'),
    })

    setOverviewData(result)
  }

  const getDateStats = async () => {
    const { result } = await apiErrorDateStat({
      startTime: date.startOf('date').format('YYYY-MM-DD HH:mm:ss'),
      endTime: date.endOf('date').format('YYYY-MM-DD HH:mm:ss'),
    })

    setDateStats(result)
  }

  const getTopList = async (sort: string, order: 'desc' | 'asc' = 'desc') => {
    const { result } = await apiErrorTopList({
      startTime: date.startOf('date').format('YYYY-MM-DD HH:mm:ss'),
      endTime: date.endOf('date').format('YYYY-MM-DD HH:mm:ss'),
      sort,
      order,
    })

    return result
  }

  return (
    <Wrapper>
      <section>
        <DateRangeSelect
          value={dateRange}
          onChange={(value) => setDateRange(value)}
        />
        <OverviewChart
          data={overviewData}
          onChangeDate={(date) => setDate(date)}
        />
      </section>
      <DateStat date={date} records={dateStats} />
      <TopListWrapper>
        <TopList title="最新错误" records={dateTopList}></TopList>
        <TopList title="高频错误" records={countTopList}></TopList>
      </TopListWrapper>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  padding: var(--padding);

  > section {
    margin-bottom: var(--padding);
    padding: var(--padding);
    background-color: var(--light-color);
    border-radius: var(--border-radius);
  }
`

const TopListWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: var(--padding);
`

export default ErrorApiHome
