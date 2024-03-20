import { DatePicker } from 'antd'
import dayjs, { Dayjs } from 'dayjs'
import { useMemo, useState } from 'react'
import styled from 'styled-components'
import { datetimeRangFromDate } from '../../../../../utils/datetime'
import ApiStat from './ApiStat'
import ApiData from './ApiData'
import ApiList from './ApiList'
import ApiDistribution from './ApiDistribution'
import ApiTerminal from './ApiTerminal'
import ApiTerritory from './ApiTerritory'

function PerformanceApiHome() {
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
      <ApiStat startTime={startTime} endTime={endTime} />
      <ApiData date={date} />
      <ApiDistribution startTime={startTime} endTime={endTime} />
      <ApiTerminal startTime={startTime} endTime={endTime} />
      <ApiList startTime={startTime} endTime={endTime} />
      <ApiTerritory startTime={startTime} endTime={endTime} />
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

export default PerformanceApiHome
