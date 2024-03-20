import { QuestionCircleOutlined } from '@ant-design/icons'
import { Tooltip } from 'antd'
import styled from 'styled-components'
import { StatRecord } from '../types'

interface Props {
  statData: StatRecord[]
}

const PerformanceStat = ({ statData }: Props) => {
  return (
    <Wrapper count={statData.length ?? 0}>
      {statData.map((i) => (
        <li key={i.type}>
          <label>
            {i.title}
            {i.desc && (
              <Tooltip title={i.desc}>
                <QuestionCircleOutlined />
              </Tooltip>
            )}
          </label>
          <span>
            {i.value ?? '--'}
            <small>&nbsp;{i.unit ?? ''}</small>
          </span>
        </li>
      ))}
    </Wrapper>
  )
}

const Wrapper = styled.ul<{ count: number }>`
  display: grid;
  grid-template-columns: ${(props) =>
    props.count >= 4
      ? '1fr 1fr 1fr 1fr'
      : Array.from({ length: props.count })
          .map(() => '1fr')
          .join(' ')};
  grid-column-gap: var(--padding);
  margin: 0 var(--margin);
  padding: 0;

  list-style: none;

  > li {
    padding: var(--padding);
    border-radius: var(--border-radius);
    background-color: var(--light-color);

    label {
      display: block;
      margin-bottom: 10px;
      color: var(--text-secondary-color);

      svg {
        margin-left: 5px;
      }
    }

    > span {
      font-size: 28px;

      small {
        color: var(--text-secondary-color);
      }
    }
  }
`

export default PerformanceStat
