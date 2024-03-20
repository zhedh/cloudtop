import { useEffect, useState } from 'react'
import Flow from './Flow'
import {
  OverviewFlowRecord,
  overviewFlow,
} from '../../../../../services/dashboard'
import { Dayjs } from 'dayjs'
import { datetimeRangFromDate } from '../../../../../utils/datetime'

interface Props {
  date: Dayjs
}

const FlowContainer: React.FC<Props> = (props) => {
  const [records, setRecords] = useState<OverviewFlowRecord[]>([])

  useEffect(() => {
    getData()
  }, [props.date])

  const getData = async () => {
    const [startTime, endTime] = datetimeRangFromDate(
      props.date,
      'YYYY-MM-DD HH:mm:ss'
    ) as string[]
    const { result } = await overviewFlow({
      startTime,
      endTime,
    })
    setRecords(result)
  }

  return <Flow records={records} />
}

export default FlowContainer
