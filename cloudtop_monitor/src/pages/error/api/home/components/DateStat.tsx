import React from 'react'
import styled from 'styled-components'
import { WARNING_COLORS } from '../../../../../constants/chart'
import { Dayjs } from 'dayjs'

interface Props {
  date: Dayjs
  records: { key: number; value: number }[]
}

function DateStat(props: Props) {
  if (!props.records.length) return null

  return (
    <Wrapper>
      <h2>
        今日概况
        <small>（{props.date?.format('YYYY-MM-DD')}）</small>
      </h2>
      <ul>
        {props.records.map((record, index) => (
          <li key={record.key}>
            <Status
              color={
                WARNING_COLORS[index] ??
                WARNING_COLORS[WARNING_COLORS.length - 1]
              }
            >
              {record.key}
            </Status>
            <Count>
              <span>{record.value}</span>
              <label>发生次数</label>
            </Count>
          </li>
        ))}
      </ul>
    </Wrapper>
  )
}

const Wrapper = styled.section`
  h2 {
    margin: 0;
    padding: 0;
    font-size: 16px;
  }

  ul {
    display: flex;
    flex-wrap: wrap;
    margin: 0;
    padding: 0;
    padding-top: var(--padding);
    list-style: none;

    > li {
      display: flex;
      align-items: center;
      /* justify-content: center; */
      box-sizing: border-box;
      width: 200px;
      height: 108px;
      padding-left: var(--padding);
      margin-right: var(--padding);
      border-radius: var(--border-radius);
      background-color: var(--background-color);
    }
  }
`

const Status = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60px;
  height: 60px;
  margin-right: var(--padding);
  border-radius: 50%;
  background-color: ${(props) => props.color};
  color: var(--light-color);
  font-size: 18px;
`

const Count = styled.div`
  display: flex;
  flex-direction: column;

  span {
    font-size: 28px;
  }

  label {
    color: var(--text-tertiary-color);
  }
`

export default React.memo(DateStat)
