import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { formatPercent } from '../../../../../utils/format'
import { PAGE_STAT_LIST } from '../constant'
import { Dayjs } from 'dayjs'
import { performancePageStat } from '../../../../../services/performance'

interface Props {
  startTime: Dayjs
  endTime: Dayjs
}

function PageStat(props: Props) {
  const { startTime, endTime } = props
  const [records, setReocrds] = useState(PAGE_STAT_LIST)

  useEffect(() => {
    getRecords()
  }, [startTime, endTime])

  const getRecords = async () => {
    const { result } = await performancePageStat({
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
    })

    setReocrds(PAGE_STAT_LIST.map((i, index) => ({ ...i, ...result[index] })))
  }

  return (
    <Wrapper>
      {records.map((item) => (
        <StatItem key={item.type}>
          <label>{item.label}</label>
          <span>
            {item.value ? item.value.toFixed(2) : '--'}
            <small>&nbsp;{item.unit}</small>
          </span>
          <aside>
            较昨日 &nbsp;
            <i className={item.ratio >= 0 ? 'up' : 'down'}>
              {item.ratio !== null ? formatPercent(item.ratio) : '--'}% &nbsp;
              {item.ratio >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            </i>
          </aside>
        </StatItem>
      ))}
    </Wrapper>
  )
}

const Wrapper = styled.ul`
  display: flex;
  justify-content: space-around;
  margin: 0 var(--margin);
  padding: var(--padding);
  list-style: none;
  border-radius: var(--border-radius);
  background-color: var(--light-color);
`

const StatItem = styled.li`
  display: flex;
  flex-direction: column;

  > label {
    font-size: 12px;
    color: var(--text-secondary-color);
  }

  > span {
    font-size: 28px;
    font-weight: bold;

    small {
      font-size: 12px;
      font-weight: normal;
      color: var(--text-tertiary-color);
    }
  }

  > aside {
    font-size: 12px;
    color: var(--text-tertiary-color);

    i.up {
      font-style: normal;
      color: var(--success-color);
    }

    i.down {
      font-style: normal;
      color: var(--error-color);
    }
  }
`

export default React.memo(PageStat)
