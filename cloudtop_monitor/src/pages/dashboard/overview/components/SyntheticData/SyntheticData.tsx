import { Radio } from 'antd'
import styled from 'styled-components'
import DataChart from './DataChart'
import { OverviewSyntheticChartRecord } from '../../../../../services/dashboard'

interface Props {
  records: OverviewSyntheticChartRecord[]
  days: number
  onDaysChange: (value: number) => void
}

const SyntheticData: React.FC<Props> = (props) => {
  return (
    <Wrapper>
      <h2>
        <span>综合数据</span>
        <Radio.Group
          value={props.days + ''}
          onChange={(e) => props.onDaysChange(+e.target.value)}
        >
          <Radio value="1">1天</Radio>
          <Radio value="7">7天</Radio>
          <Radio value="30">30天</Radio>
        </Radio.Group>
      </h2>
      <ul>
        {props.records.map((record) => (
          <li key={record.type}>
            <DataChart data={record} />
          </li>
        ))}
      </ul>
    </Wrapper>
  )
}

const Wrapper = styled.section`
  .ant-radio-group {
    font-weight: normal;
  }

  ul {
    margin: 0;
    padding: 0;
    list-style: none;

    display: grid;
    grid-template-columns: 1fr 1fr;

    > li {
      padding: var(--padding);
      border-radius: var(--border-radius);
      background-color: var(--light-color);
      margin-bottom: calc(var(--padding) / 2);

      &:nth-child(odd) {
        margin-right: calc(var(--padding) / 2);
      }

      &:nth-child(event) {
        margin-right: calc(var(--padding) / 2);
      }
    }
  }
`

export default SyntheticData
