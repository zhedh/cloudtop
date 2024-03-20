import React from 'react'
import styled from 'styled-components'
import { ResourceErrorTopRecord } from '../../../../services/error'
import dayjs from 'dayjs'
import { LayoutOutlined, NumberOutlined, TeamOutlined } from '@ant-design/icons'
import { Empty } from 'antd'

const Component = (props: { records: ResourceErrorTopRecord[] }) => {
  return (
    <Wrapper>
      {props.records.map((record) => (
        <li key={record.id}>
          <main>
            <p>{record.src}</p>
            <span>
              <NumberOutlined />
              {record.count ?? '--'}
            </span>
            <span>
              <LayoutOutlined />
              {record.pvCount ?? '--'}
            </span>
            <span>
              <TeamOutlined />
              {record.userCount ?? '--'}
            </span>
          </main>

          <aside>
            {dayjs(record.reportTime).format('YYYY-MM-DD HH:mm:ss')}
          </aside>
        </li>
      ))}
      {props.records.length === 0 && <Empty />}
    </Wrapper>
  )
}

const Wrapper = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;

  > li {
    padding: 10px var(--padding);
    display: flex;
    justify-content: space-between;
    align-items: center;

    &:nth-child(odd) {
      background-color: var(--background-color);
    }

    main {
      flex: 1;
    }

    p {
      margin: 0;
      margin-bottom: 5px;
      word-break: break-all;
      color: var(--text-secondary-color);
    }

    main > span {
      margin-right: 12px;
      color: var(--text-tertiary-color);

      svg {
        margin-right: 5px;
        font-size: 16px;
        color: var(--primary-color);
      }
    }

    aside {
      flex-shrink: 0;
      margin-left: 20px;
      color: var(--text-tertiary-color);
    }
  }
`

const TopList = React.memo(Component)
export default TopList
