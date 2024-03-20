import { Button, Table } from 'antd'
import dayjs from 'dayjs'
import { ApiErrorTopRecordItem } from '../../../../../services/error'
import { useNavigate } from 'react-router-dom'

interface Props {
  records: ApiErrorTopRecordItem[]
}

function TopListDetail(props: Props) {
  const navigate = useNavigate()

  const columns = [
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,

      // width: 'auto',
    },
    {
      title: '报错接口',
      dataIndex: 'api',
      key: 'api',
    },
    {
      title: '页面',
      dataIndex: 'src',
      key: 'src',
    },
    {
      title: '标识信息',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '发生时间',
      dataIndex: 'date',
      key: 'date',
      width: 220,
      render: (date: number) => dayjs(date).format('YYYY.MM.DD HH:mm:ss'),
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      render: (_: string, record: ApiErrorTopRecordItem) => (
        <Button
          type="link"
          onClick={() => navigate(`/monitor/behavior/detail/${record.uid}`)}
        >
          查看足迹
        </Button>
      ),
    },
  ]

  return (
    <Table
      size="small"
      rowKey="id"
      columns={columns}
      dataSource={props.records}
    />
  )
}

export default TopListDetail
