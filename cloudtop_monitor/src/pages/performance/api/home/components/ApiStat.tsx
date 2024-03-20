import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons'
import React, { useEffect, useState } from 'react'
import { Tooltip } from 'antd'
import styled from 'styled-components'
import { Dayjs } from 'dayjs'
import { formatPercent } from '../../../../../utils/format'
import { performanceApiStat } from '../../../../../services/performance'
import { API_STAT_LIST } from '../constant'

interface Props {
  startTime: Dayjs
  endTime: Dayjs
}

function ApiStat(props: Props) {
  const { startTime, endTime } = props
  const [records, setReocrds] = useState(API_STAT_LIST)

  useEffect(() => {
    getRecords()
  }, [startTime, endTime])

  const getRecords = async () => {
    const { result } = await performanceApiStat({
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
    })

    setReocrds(API_STAT_LIST.map((i, index) => ({ ...i, ...result[index] })))
  }

  return (
    <Wrapper>
      {records.map((item) => (
        <StatItem key={item.type}>
          <label>
            {item.label}
            &nbsp;
            {item.desc && (
              <Tooltip title={item.desc}>
                <QuestionCircleOutlined />
              </Tooltip>
            )}
          </label>
          <span>
            {item.formatValue ? item.formatValue(item.value) : item.value}
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

export default React.memo(ApiStat)
