import { Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import styled from 'styled-components'
import { PerformanceApiTerritoryRecord } from '../../../../../services/performance'
import { formatPercent } from '../../../../../utils/format'

export interface PerformanceTopRecord {
  key: string
  count: number
  time: number
}

interface Props {
  title: string
  data: PerformanceApiTerritoryRecord[]
}

function TerritoryList(props: Props) {
  const columns: ColumnsType<PerformanceApiTerritoryRecord> = [
    {
      title: '区域',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: '请求数',
      dataIndex: 'count',
      key: 'count',
    },
    {
      title: '成功率',
      dataIndex: 'successRatio',
      key: 'successRatio',
      render(value) {
        return formatPercent(value) + '%'
      },
    },
  ]

  return (
    <Wrapper>
      <Table
        bordered={false}
        size="small"
        rowKey="key"
        columns={columns}
        dataSource={props.data}
        pagination={false}
      />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  border-radius: var(--border-radius);
  background-color: var(--light-color);
  padding: var(--padding) var(--padding);

  > h3 {
    margin: 0;
    padding-bottom: var(--padding);
    font-size: 16px;
  }

  table {
  }

  .ant-table-thead > tr > th {
    border-bottom: none;
    background-color: #f8f9fb;

    &::before {
      display: none;
    }

    &:last-child {
      text-align: right;
    }
  }

  .ant-table-tbody > tr > td {
    border-bottom: none;

    &:last-child {
      text-align: right;
    }
  }

  .ant-table-tbody > tr:nth-child(even) {
    background-color: #f8f9fb;
  }
`

export default TerritoryList
