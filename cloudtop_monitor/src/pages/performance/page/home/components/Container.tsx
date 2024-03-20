import { DatePicker } from 'antd'
import dayjs, { Dayjs } from 'dayjs'
import { useMemo, useState } from 'react'
import styled from 'styled-components'
import { datetimeRangFromDate } from '../../../../../utils/datetime'
import PageStat from './PageStat'
import PageList from './PageList'
import PageWaterfall from './PageWaterfall'
import PageTerritory from './PageTerritory'
import PageRatio from './PageRatio'
import PageData from './PageData'

function PerformancePageHome() {
  const [date, setDate] = useState<Dayjs>(dayjs())
  const [startTime, endTime] = useMemo(() => datetimeRangFromDate(date), [date])

  return (
    <Wrapper>
      <h2>
        <span></span>
        <DatePicker
          value={date}
          disabledDate={(date) => date > dayjs()}
          onChange={(date) => setDate(date!)}
          allowClear={false}
          placeholder="今天"
        />
      </h2>
      <PageStat startTime={startTime} endTime={endTime} />
      <PageData date={date} />
      <PageWaterfall startTime={startTime} endTime={endTime} />
      <PageRatio startTime={startTime} endTime={endTime} />
      <PageList startTime={startTime} endTime={endTime} />
      <PageTerritory startTime={startTime} endTime={endTime} />
    </Wrapper>
  )
}

const Wrapper = styled.article`
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

export default PerformancePageHome
