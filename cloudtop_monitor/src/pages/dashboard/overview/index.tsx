import styled from 'styled-components'
import FlowContainer from './components/Flow'
import { useState } from 'react'
import dayjs, { Dayjs } from 'dayjs'
import { DatePicker } from 'antd'
import CoreChartContainer from './components/CoreChart'
import SyntheticDataContainer from './components/SyntheticData'

const Overview = () => {
  const [date, setDate] = useState<Dayjs>(dayjs())

  return (
    <Wrapper>
      <section>
        <h2>
          <span>核心数据</span>
          <DatePicker
            value={date}
            disabledDate={(date) => date > dayjs()}
            onChange={(date) => setDate(date!)}
            allowClear={false}
            placeholder="今天"
          />
        </h2>
        <FlowContainer date={date}></FlowContainer>

        <CoreChartContainer date={date}></CoreChartContainer>
      </section>
      <SyntheticDataContainer date={date} />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  padding: 0 var(--padding) 10px;

  section {
    padding-top: 10px;
  }

  section h2 {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0;
    padding: var(--padding) 0;
    font-size: 18px;
  }
`

export default Overview
