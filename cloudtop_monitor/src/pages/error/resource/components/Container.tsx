import styled from 'styled-components'
import { useEffect, useState } from 'react'
import dayjs, { Dayjs } from 'dayjs'
import { FieldTimeOutlined } from '@ant-design/icons'
import OverviewChart from './OverviewChart'
import {
  ResourceErrorStatData,
  ResourceErrorTopRecord,
  resourceErrorOverview,
  resourceErrorStat,
  resourceErrorTopList,
} from '../../../../services/error'
import TopList from './TopList'
import DateRangeSelect from '../../../../components/DateRangeSelect'
import { ChartRecord } from '../../../../types'
import ErrorStat from './ErrorStat'

const ResourceError = () => {
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
    dayjs().subtract(1, 'month').add(1, 'day'),
    dayjs(),
  ])
  const [date, setDate] = useState(dateRange[1])
  const [overviewData, setOverviewData] = useState<ChartRecord[]>([])
  const [statData, setStatData] = useState<ResourceErrorStatData>(
    {} as ResourceErrorStatData
  )
  const [topList, setTopList] = useState<ResourceErrorTopRecord[]>([])

  useEffect(() => {
    getOverviewChart()
    setDate(dateRange[1])
  }, [dateRange])

  useEffect(() => {
    getErrorStat()
    getErrorTopList()
  }, [date])

  const getOverviewChart = async () => {
    const [startDate, endDate] = dateRange
    const { result } = await resourceErrorOverview({
      startDate: startDate.format('YYYY-MM-DD'),
      endDate: endDate.format('YYYY-MM-DD'),
    })

    setOverviewData(result)
  }

  const getErrorStat = async () => {
    const { result } = await resourceErrorStat({
      startTime: date.startOf('date').format('YYYY-MM-DD HH:mm:ss'),
      endTime: date.endOf('date').format('YYYY-MM-DD HH:mm:ss'),
    })

    setStatData(result)
  }

  const getErrorTopList = async () => {
    const { result } = await resourceErrorTopList({
      startTime: date.startOf('date').format('YYYY-MM-DD HH:mm:ss'),
      endTime: date.endOf('date').format('YYYY-MM-DD HH:mm:ss'),
    })

    setTopList(result)
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
      <section>
        <header>
          <span>资源错误统计</span>
          <small>
            <FieldTimeOutlined />
            {date.format('YYYY-MM-DD')}
          </small>
        </header>
        <ErrorStat data={statData} />
        <TopList records={topList}></TopList>
      </section>
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

    &:nth-child(1) {
      padding-bottom: 0;
    }

    &:nth-child(2) {
      > header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        span {
          font-size: 16px;
          font-weight: bold;
        }

        small {
          display: flex;
          align-items: center;
          font-size: 14px;
          color: var(--text-secondary-color);

          svg {
            margin-right: 10px;
            color: var(--primary-color);
            font-size: 18px;
          }
        }
      }
    }
  }
`

export default ResourceError
