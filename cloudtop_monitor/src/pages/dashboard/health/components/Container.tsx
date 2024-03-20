import { DatePicker } from 'antd'
import dayjs, { Dayjs } from 'dayjs'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import HealthScore from './HealthScore'
import { HealthScoreData, healthScore } from '../../../../services/dashboard'
import AnomalyTrend from './AnomalyTrend'
import { HEALTH_CHART_OPTIONS } from '../constant'
import { datetimeRangFromDate } from '../../../../utils/datetime'

const Health: React.FC = () => {
  const [date, setDate] = useState<Dayjs>(dayjs())
  const [scoreData, setScoreData] = useState<HealthScoreData>({
    score: 0,
    records: [],
  })

  useEffect(() => {
    getHealthScore()
  }, [date])

  const getHealthScore = async () => {
    const [startTime, endTime] = datetimeRangFromDate(
      date || dayjs(),
      'YYYY-MM-DD HH:mm:ss'
    ) as string[]
    const { result } = await healthScore({
      startTime,
      endTime,
    })

    setScoreData(result)
  }

  return (
    <Wrapper>
      <h2>
        <span>健康数据</span>
        <DatePicker
          value={date}
          disabledDate={(date) => date > dayjs()}
          onChange={(date) => setDate(date!)}
          allowClear={false}
          placeholder="今天"
        />
      </h2>
      <HealthScore scoreData={scoreData} />
      <ChartList>
        {HEALTH_CHART_OPTIONS.map((option) => (
          <AnomalyTrend key={option.value} date={date} record={option} />
        ))}
      </ChartList>
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

const ChartList = styled.section`
  display: grid;
  list-style: none;
  grid-template-columns: 1fr 1fr;
  grid-gap: var(--padding);

  margin: var(--margin);
  padding: 0;
`

export default Health
