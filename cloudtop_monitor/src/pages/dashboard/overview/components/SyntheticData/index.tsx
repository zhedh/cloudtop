import { useEffect, useState } from 'react'
import { Dayjs } from 'dayjs'
import SyntheticData from './SyntheticData'
import {
  OverviewSyntheticChartRecord,
  overviewSyntheticChart,
} from '../../../../../services/dashboard'

interface Props {
  date: Dayjs
}

const SyntheticDataContainer = (props: Props) => {
  const [days, setDays] = useState(1)
  const [records, setRecords] = useState<OverviewSyntheticChartRecord[]>([])

  useEffect(() => {
    getData()
  }, [props.date, days])

  const getData = async () => {
    const endTime = props.date.endOf('date')
    const startTime = endTime.subtract(days - 1, 'day').startOf('date')
    const { result } = await overviewSyntheticChart({
      startTime: startTime.format('YYYY-MM-DD HH:mm:ss'),
      endTime: endTime.format('YYYY-MM-DD HH:mm:ss'),
    })

    setRecords(result)
  }

  return (
    <SyntheticData
      records={records}
      days={days}
      onDaysChange={(value) => setDays(value)}
    />
  )
}

export default SyntheticDataContainer
