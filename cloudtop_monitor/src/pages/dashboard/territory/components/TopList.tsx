import { Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import styled from 'styled-components'

export interface PerformanceTopRecord {
  key: string
  count: number
  time: number
}

interface Props {
  title: string
  data: { name: string; value: number }[]
}

function TopList(props: Props) {
  const columns: ColumnsType<{ name: string; value: number }> = [
    {
      title: '排名',
      dataIndex: 'index',
      key: 'index',
      render: (_, __, index) => index + 1,
    },
    {
      title: '区域',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '用户数',
      dataIndex: 'value',
      key: 'value',
    },
  ]

  return (
    <Wrapper>
      <h3>{props.title}</h3>
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

export default TopList
