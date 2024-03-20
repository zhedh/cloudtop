import { DatePicker } from 'antd'
import styled from 'styled-components'
import { useEffect, useState } from 'react'
import dayjs, { Dayjs } from 'dayjs'
import axios from 'axios'
import { territoryUserStat } from '../../../../services/dashboard'
import TopList from './TopList'
import { datetimeRangFromDate } from '../../../../utils/datetime'
import TerritoryChart from './TerritoryChart'

const Territory = () => {
  const [date, setDate] = useState<Dayjs | null>()
  const [mapJson, setMapJson] = useState()
  const [mapData, setMapData] = useState<{ name: string; value: number }[]>([])

  useEffect(() => {
    getCnJson()
  }, [])

  useEffect(() => {
    getMapData()
  }, [date])

  const getCnJson = async () => {
    const { data } = await axios.get('/china.json')
    setMapJson(data)
  }

  const getMapData = async () => {
    const [startTime, endTime] = datetimeRangFromDate<string>(
      date!,
      'YYYY-MM-DD HH:mm:ss'
    )
    const { result } = await territoryUserStat({ startTime, endTime })
    setMapData(result.map((i) => ({ ...i, name: i.key })))
  }

  return (
    <Wrapper>
      <h2>
        <span></span>
        <DatePicker
          value={date}
          disabledDate={(date) => date > dayjs()}
          onChange={(date) => setDate(date)}
          allowClear
          placeholder="今天"
        />
      </h2>
      <SectionWrapper>
        <TerritoryChart data={mapData} mapJson={mapJson as never} />
        <TopList title="访问用户区域分布排行" data={mapData}></TopList>
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
  grid-template-columns: 2fr 1fr;
  grid-column-gap: var(--padding);
  margin: 0 var(--margin);
`

export default Territory
