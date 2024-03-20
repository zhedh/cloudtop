import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons'
import { Card } from 'antd'
import styled from 'styled-components'
import { OverviewFlowRecord } from '../../../../../services/dashboard'
import { OVERVIEW_FLOW_TYPE_MAP } from '../../../../../constants/dashboard'

interface Props {
  records: OverviewFlowRecord[]
}

const Flow: React.FC<Props> = (props) => {
  return (
    <Card title="流量数据" bordered={false}>
      <List>
        {props.records.map((flow) => (
          <li key={flow.type}>
            <label>{OVERVIEW_FLOW_TYPE_MAP[flow.type]}</label>
            <span>{flow.value}</span>
            <aside>
              较昨日 &nbsp;
              <i className={flow.ratio >= 0 ? 'up' : 'down'}>
                {flow.ratio !== null ? (flow.ratio * 100).toFixed(2) : '--'}%
                &nbsp;
                {flow.ratio >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
              </i>
            </aside>
          </li>
        ))}
      </List>
    </Card>
  )
}

const List = styled.ul`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;

  margin: 0;
  padding: 0;
  list-style: none;

  > li {
    display: flex;
    flex-direction: column;
    text-align: center;
    padding: 10px;

    > label {
      color: var(--text-tertiary-color);
    }

    > span {
      margin-top: 5px;
      font-size: 24px;
    }

    aside {
      margin-top: 5px;
      color: var(--text-tertiary-color);

      i {
        font-style: normal;
        font-size: 12px;

        &.up {
          color: var(--success-color);
        }

        &.down {
          color: var(--error-color);
        }
      }
    }
  }
`

export default Flow
