import React, { useState } from 'react'
import { Drawer, Table } from 'antd'
import styled from 'styled-components'
import dayjs from 'dayjs'
import {
  ApiErrorTopRecord,
  ApiErrorTopRecordItem,
} from '../../../../../services/error'
import { WARNING_COLORS } from '../../../../../constants/chart'
import TopListDetail from './TopListDetail'

interface Props {
  records: ApiErrorTopRecord[]
  title: string
}

function TopList(props: Props) {
  const [visible, setVisible] = useState(false)
  const [detailRecords, setDetailRecords] = useState<ApiErrorTopRecordItem[]>(
    []
  )

  const handleView = (record: ApiErrorTopRecord) => {
    setVisible(true)
    setDetailRecords(record.records)
  }

  const columns = [
    {
      title: props.title,
      dataIndex: 'id',
      key: 'id',
      render: (_: string, record: ApiErrorTopRecord) => (
        <MessageInfo onClick={() => handleView(record)}>
          <p>{record.api || '--'}&nbsp;</p>
          <small>
            {dayjs(record.timeRange[0]).format('YYYY-MM-DD HH:mm:ss')}
            &nbsp;~&nbsp;
            {dayjs(record.timeRange[1]).format('YYYY-MM-DD HH:mm:ss')}
          </small>
        </MessageInfo>
      ),
      width: 'auto',
    },
    {
      title: '发生次数',
      dataIndex: 'count',
      key: 'count',
      render: (count: number, record: ApiErrorTopRecord) => (
        <CountWrapper>
          {record.status}
          <small>（{count}）</small>
        </CountWrapper>
      ),
    },
    {
      title: '影响人数',
      dataIndex: 'userCount',
      key: 'userCount',
    },
  ]

  return (
    <>
      <Table
        rowKey="id"
        dataSource={props.records}
        columns={columns}
        pagination={false}
        size="small"
      />
      <Drawer
        title="错误详情"
        placement="right"
        width="80%"
        onClose={() => setVisible(false)}
        open={visible}
      >
        <TopListDetail records={detailRecords}></TopListDetail>
      </Drawer>
    </>
  )
}

const MessageInfo = styled.div`
  max-width: 460px;

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

  small {
    font-weight: normal;
    color: var(--text-tertiary-color);
  }
`

const CountWrapper = styled.div`
  color: ${WARNING_COLORS[0]};
  font-size: 18px;

  small {
    color: var(--text-secondary-color);
  }
`

export default React.memo(TopList)
