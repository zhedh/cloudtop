import React, { useEffect, useState } from 'react'
import { Table } from 'antd'
import { Dayjs } from 'dayjs'
import styled from 'styled-components'
import { ColumnsType } from 'antd/es/table'
import Search from 'antd/es/input/Search'
import Card from '../../../../../components/Card'
import {
  PerformanceApiListRecord,
  performanceApiList,
} from '../../../../../services/performance'
import { formatElapsedTime, formatPercent } from '../../../../../utils/format'
// import ApiItemDetail from './ApiItemDetail'

interface Props {
  startTime: Dayjs
  endTime: Dayjs
}

function ApiList(props: Props) {
  const [records, setReocrds] = useState<PerformanceApiListRecord[]>([])
  // const [detailVisible, setDetailVisible] = useState(true)
  // const [currentRecord, setCurrentRecord] =
  //   useState<PerformancePageListRecord>()

  useEffect(() => {
    getRecords()
  }, [props.startTime, props.endTime])

  const getRecords = async (api = '') => {
    const { startTime, endTime } = props
    const { result } = await performanceApiList({
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      api,
    })

    setReocrds(result)
  }

  const handleSearch = (api: string) => {
    getRecords(api)
  }

  // const handleViewDetail = (record: PerformanceApiListRecord) => {
  //   setDetailVisible(true)
  //   setCurrentRecord(record)
  // }

  const columns: ColumnsType<PerformanceApiListRecord> = [
    {
      title: 'API',
      dataIndex: 'api',
      key: 'api',
      width: 240,
      fixed: 'left',
    },
    {
      title: '请求数',
      dataIndex: 'count',
      key: 'count',
      width: 90,
    },
    {
      title: '成功率',
      dataIndex: 'successRatio',
      key: 'successRatio',
      width: 100,
      render: (value) => formatPercent(value) + '%',
    },
    {
      title: '错误次数',
      dataIndex: 'errorCount',
      key: 'errorCount',
      width: 100,
    },
    {
      title: '错误用户数',
      dataIndex: 'errorUserCount',
      key: 'errorUserCount',
      width: 120,
    },
    {
      title: '缓慢次数',
      dataIndex: 'ready',
      key: 'ready',
      width: 120,
      render: (_: string, record) => (
        <span
          style={{
            color:
              record.slowCount > 0
                ? 'var(--warning-color)'
                : 'var(--text-color)',
          }}
        >
          {record.slowCount}({formatPercent(record.slowRatio) + '%'})
        </span>
      ),
    },
    {
      title: '平均耗时',
      dataIndex: 'time',
      key: 'time',
      width: 100,
      render: (value) => formatElapsedTime(value),
    },

    // {
    //   title: '操作',
    //   width: 120,
    //   fixed: 'right',
    //   render: (_, record) => (
    //     <Button type="link" onClick={() => handleViewDetail(record)}>
    //       查看详情
    //     </Button>
    //   ),
    // },
  ]

  return (
    <>
      <Wrapper
        title="接口性能列表"
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
          rowKey="api"
          columns={columns}
          dataSource={records}
        />
      </Wrapper>
      {/* {currentRecord && (
        <ApiItemDetail
          visible={detailVisible}
          record={currentRecord}
          startTime={props.startTime}
          endTime={props.endTime}
          onClose={() => setDetailVisible(false)}
        />
      )} */}
    </>
  )
}

const Wrapper = styled(Card)`
  margin: var(--margin);
`

export default React.memo(ApiList)
