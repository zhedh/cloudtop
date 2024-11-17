import { QuestionCircleOutlined } from '@ant-design/icons'
import { Tooltip } from 'antd'
import styled from 'styled-components'

export interface PerformanceTopRecord {
  key: string
  count: number
  time: number
}

interface Props {
  title: string
  headers: string[]
  data: PerformanceTopRecord[]
}

function TopList(props: Props) {
  const formatTime = (time: number) => {
    // if (time) return ''
    if (time < 1000) return time.toFixed(2) + 'ms'
    return (time / 1000).toFixed(2) + 's'
  }

  return (
    <Wrapper>
      <h3>
        {props.title}&nbsp;
        <Tooltip title="这里只统计首次加载页面的耗时，单页应用(SPA)首次加载后，应用内切换路由是不会统计加载耗时的。">
          <QuestionCircleOutlined />
        </Tooltip>
      </h3>
      <ul>
        <li>
          {props.headers.map((i) => (
            <span key={i}>{i}</span>
          ))}
        </li>
        {props.data.slice(0, 10).map((record) => (
          <li key={record.key}>
            <span>{decodeURIComponent(record.key)}</span>
            <span>{record.count}</span>
            <span>{formatTime(record.time)}</span>
          </li>
        ))}
      </ul>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  border-radius: var(--border-radius);
  background-color: var(--light-color);

  > h3 {
    margin: 0;
    padding: var(--padding) var(--padding) 0;
    font-size: 16px;
  }

  > ul {
    margin: 0;
    padding: var(--padding);
    list-style: none;

    > li {
      display: flex;
      justify-content: space-between;
      padding: 5px 0;
      color: var(--text-secondary-color);

      &:first-child {
        font-weight: bold;
        color: var(--text-color);
      }

      span {
        display: block;
        padding: 0 10px;
        min-width: 80px;
      }

      span:first-child {
        flex: 1;
        padding-left: 0;
        word-break: break-all;
      }

      span:last-child {
        padding-right: 0;
        text-align: right;
      }
    }
  }
`

export default TopList
