import React from 'react'
import styled from 'styled-components'
import { ResourceErrorStatData } from '../../../../services/error'
import { LayoutOutlined, NumberOutlined, TeamOutlined } from '@ant-design/icons'

const Component = (props: { data: ResourceErrorStatData }) => {
  return (
    <Wrapper>
      <li>
        <NumberOutlined />
        <label>总发生次数</label>
        <span>{props.data.count}</span>
      </li>
      <li>
        <LayoutOutlined />
        <label>影响页面数</label>
        <span>{props.data.pv}</span>
      </li>
      <li>
        <TeamOutlined />
        <label>影响用户数</label>
        <span>{props.data.uv}</span>
      </li>
    </Wrapper>
  )
}

const Wrapper = styled.ul`
  margin: 20px var(--padding);
  padding: 0;
  list-style: none;

  display: flex;
  justify-content: space-around;

  li {
    display: flex;
    flex-direction: column;
    align-items: center;

    svg {
      font-size: 28px;
      color: var(--primary-color);
    }

    label {
      margin-top: 10px;
      font-size: 12px;
      color: var(--text-tertiary-color);
    }

    span {
      font-size: 20px;
    }
  }
`

const ErrorStat = React.memo(Component)
export default ErrorStat
