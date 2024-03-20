import React from 'react'
import { Table } from 'antd'
import { JsErrorTopRecord } from '../../../../services/error'
import styled from 'styled-components'
import dayjs from 'dayjs'

const Component = (props: { records: JsErrorTopRecord[] }) => {
  const columns = [
    {
      title: '最新错误',
      dataIndex: 'id',
      key: 'id',
      render: (_: string, record: JsErrorTopRecord) => (
        <MessageInfo>
          <h5>
            {record.category}
            <small>
              {dayjs(record.reportTime).format('YYYY-MM-DD HH:mm:ss')}
            </small>
          </h5>
          <p>{record.msg}</p>
        </MessageInfo>
      ),
      width: 'auto',
    },
    {
      title: '发生次数',
      dataIndex: 'count',
      key: 'count',
    },
    {
      title: '影响人数',
      dataIndex: 'userCount',
      key: 'userCount',
    },
  ]

  return (
    <Table
      rowKey="id"
      dataSource={props.records}
      columns={columns}
      pagination={false}
      size="small"
    />
  )
}

const MessageInfo = styled.div`
  max-width: 500px;

  h5 {
    margin: 0;
    font-size: 16px;
    color: var(--primary-color);

    small {
      margin-left: 10px;
      font-weight: normal;
      color: var(--text-tertiary-color);
    }
  }

  p {
    margin: 0;
    margin-top: 5px;
    color: var(--text-secondary-color);

    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }
`

const TopList = React.memo(Component)
export default TopList
