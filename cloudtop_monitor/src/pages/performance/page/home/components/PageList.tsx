import React, { useEffect, useState } from 'react'
import { Button, Table } from 'antd'
import { Dayjs } from 'dayjs'
import styled from 'styled-components'
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons'
import { ColumnsType } from 'antd/es/table'
import Search from 'antd/es/input/Search'
import Card from '../../../../../components/Card'
import {
  PerformancePageListRecord,
  performancePageList,
} from '../../../../../services/performance'
import { formatElapsedTime, formatPercent } from '../../../../../utils/format'
import PageItemDetail from './PageItemDetail'

interface Props {
  startTime: Dayjs
  endTime: Dayjs
}

function PageList(props: Props) {
  const [records, setReocrds] = useState<PerformancePageListRecord[]>([])
  const [detailVisible, setDetailVisible] = useState(true)
  const [currentRecord, setCurrentRecord] =
    useState<PerformancePageListRecord>()

  useEffect(() => {
    getRecords()
  }, [props.startTime, props.endTime])

  const getRecords = async (page = '') => {
    const { startTime, endTime } = props
    const { result } = await performancePageList({
      startTime: startTime.format('YYYY-MM-DD HH:mm:ss'),
      endTime: endTime.format('YYYY-MM-DD HH:mm:ss'),
      page,
    })

    setReocrds(result)
  }

  const handleSearch = (value: string) => {
    getRecords(value)
  }

  const handleViewDetail = (record: PerformancePageListRecord) => {
    setDetailVisible(true)
    setCurrentRecord(record)
  }

  const renderElapsedTime = (value: number, rate: number) => {
    return (
      <ElapsedTimeWrapper>
        <span>{formatElapsedTime(value)}</span>
        <i className={rate >= 0 ? 'up' : 'down'}>
          {rate >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
          {rate !== null ? formatPercent(rate) : '--'}%
        </i>
      </ElapsedTimeWrapper>
    )
  }

  const columns: ColumnsType<PerformancePageListRecord> = [
    {
      title: '页面PAGE',
      dataIndex: 'page',
      key: 'page',
      width: 200,
      fixed: 'left',
    },
    {
      title: '采样数',
      dataIndex: 'count',
      key: 'count',
      width: 90,
    },
    {
      title: '首字节',
      dataIndex: 'ttfb',
      key: 'ttfb',
      width: 180,
      render: (_: string, record: PerformancePageListRecord) =>
        renderElapsedTime(record.ttfb, record.ttfbRate),
    },
    {
      title: 'DOM Ready',
      dataIndex: 'ready',
      key: 'ready',
      width: 180,
      render: (_: string, record: PerformancePageListRecord) =>
        renderElapsedTime(record.ready, record.readyRate),
    },
    {
      title: '页面完全加载',
      dataIndex: 'load',
      key: 'load',
      width: 180,
      render: (_: string, record: PerformancePageListRecord) =>
        renderElapsedTime(record.load, record.loadRate),
    },
    {
      title: '最大内容绘制',
      dataIndex: 'lcp',
      key: 'lcp',
      width: 180,
      render: (_: string, record: PerformancePageListRecord) =>
        renderElapsedTime(record.lcp, record.lcpRate),
    },
    {
      title: '操作',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Button type="link" onClick={() => handleViewDetail(record)}>
          查看详情
        </Button>
      ),
    },
  ]

  return (
    <>
      <Wrapper
        title="页面性能列表"
        actions={
          <Search
            placeholder="请输入页面PAGE"
            allowClear
            onSearch={handleSearch}
          />
        }
      >
        <Table
          scroll={{ y: 'auto' }}
          rowKey="page"
          columns={columns}
          dataSource={records}
        />
      </Wrapper>
      {currentRecord && (
        <PageItemDetail
          visible={detailVisible}
          record={currentRecord}
          startTime={props.startTime}
          endTime={props.endTime}
          onClose={() => setDetailVisible(false)}
        />
      )}
    </>
  )
}

const Wrapper = styled(Card)`
  margin: var(--margin);
`

const ElapsedTimeWrapper = styled.div`
  > span {
    margin-right: 10px;
  }

  i.up {
    font-style: normal;
    color: var(--success-color);
  }

  i.down {
    font-style: normal;
    color: var(--error-color);
  }
`

export default React.memo(PageList)
