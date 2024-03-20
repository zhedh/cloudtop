import styled from 'styled-components'
import { useEffect, useState } from 'react'
import dayjs, { Dayjs } from 'dayjs'
import ErrorChart from './ErrorChart'
import {
  JsErrorChartRecord,
  JsErrorOverviewRecord,
  JsErrorTopRecord,
  jsErrorChart,
  jsErrorOverview,
  jsErrorTopList,
} from '../../../../services/error'
import TopList from './TopList'
import { FieldTimeOutlined } from '@ant-design/icons'
import DateRangeSelect from '../../../../components/DateRangeSelect'
import OverviewChart from './OverviewChart'

const JsError = () => {
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
    dayjs().subtract(1, 'month').add(1, 'day'),
    dayjs(),
  ])
  const [date, setDate] = useState<Dayjs>(dateRange[1])
  const [overviewData, setOverviewData] = useState<JsErrorOverviewRecord[]>([])
  const [dateErrorData, setDateErrorData] = useState<JsErrorChartRecord[]>([])
  const [topList, setTopList] = useState<JsErrorTopRecord[]>([])

  useEffect(() => {
    getOverviewChart()
    setDate(dateRange[1])
  }, [dateRange])

  useEffect(() => {
    getErrorChart()
    getErrorTopList()
  }, [date])

  const getOverviewChart = async () => {
    const [startDate, endDate] = dateRange
    const { result } = await jsErrorOverview({
      startDate: startDate.format('YYYY-MM-DD'),
      endDate: endDate.format('YYYY-MM-DD'),
    })

    setOverviewData(result)
  }

  const getErrorChart = async () => {
    const { result } = await jsErrorChart({
      startTime: date.startOf('date').format('YYYY-MM-DD HH:mm:ss'),
      endTime: date.endOf('date').format('YYYY-MM-DD HH:mm:ss'),
    })

    setDateErrorData(result)
  }

  const getErrorTopList = async () => {
    const { result } = await jsErrorTopList({
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
          <span>JS错误</span>
          <small>
            <FieldTimeOutlined />
            {date.format('YYYY-MM-DD')}
          </small>
        </header>
        <ErrorChart data={dateErrorData} />
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

export default JsError
