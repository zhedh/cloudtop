import { Button, Table } from 'antd'
import styled from 'styled-components'
import { ColumnsType } from 'antd/es/table'
import { PaginationProps } from '../../../../types'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom'
import { Behavior } from '../../../../types/behavior'

interface Props {
  records: Behavior[]
  pagination: PaginationProps
  onPaginationChange: (current: number, pageSize: number) => void
}

const List: React.FC<Props> = (props) => {
  const navigator = useNavigate()
  // const {current, pageSize} = props.pagination
  const columns: ColumnsType<Behavior> = [
    {
      title: '用户ID',
      dataIndex: 'uid',
      key: 'uid',
      width: 180,
    },
    {
      title: '登录ID',
      dataIndex: 'loginId',
      key: 'loginId',
      width: 140,
    },
    // {
    //   title: '地址',
    //   dataIndex: 'src',
    //   key: 'src',
    //   width: 300,
    // },
    {
      title: '页面',
      dataIndex: 'page',
      key: 'page',
      width: 180,
    },
    {
      title: '发生时间',
      dataIndex: 'reportTime',
      key: 'reportTime',
      width: 180,
      render: (reportTime) => dayjs(reportTime).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      dataIndex: 'actions',
      key: 'actions',
      width: 100,
      fixed: 'right',
      render: (_, { uid }) => (
        <Button
          type="link"
          onClick={() => navigator(`/monitor/behavior/detail/${uid}`)}
        >
          查看明细
        </Button>
      ),
    },
  ]

  return (
    <Wrapper>
      <Table
        scroll={{ y: 'auto' }}
        rowKey="id"
        dataSource={props.records}
        columns={columns}
        size="middle"
        pagination={{
          ...props.pagination,
          onChange: props.onPaginationChange,
        }}
      />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  margin: 0 var(--padding);
  background-color: var(--light-color);

  .ant-table.ant-table-middle .ant-table-thead > tr > th {
    padding: 12px 14px;

    :last-child {
      text-align: right;
    }
  }

  .ant-table.ant-table-middle .ant-table-tbody > tr > td {
    padding: 12px 14px;
  }
`

export default List
