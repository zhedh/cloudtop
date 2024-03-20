import { useEffect, useState } from 'react'
import PvChart from './CoreChart'
import { Dayjs } from 'dayjs'
import {
  OverviewCoreChartRecord,
  overviewCoreChart,
} from '../../../../../services/dashboard'
import { OverviewChartType } from '../../../../../types/dashboard'
import { datetimeRangFromDate } from '../../../../../utils/datetime'

interface Props {
  date: Dayjs
}
const PvChartContainer: React.FC<Props> = (props) => {
  const [type, setType] = useState(OverviewChartType.PV)
  const [records, setRecords] = useState<OverviewCoreChartRecord[]>([])

  useEffect(() => {
    getData()
  }, [props.date])

  const getData = async () => {
    const [startTime, endTime] = datetimeRangFromDate(
      props.date,
      'YYYY-MM-DD HH:mm:ss'
    ) as string[]
    const { result } = await overviewCoreChart({
      startTime,
      endTime,
    })
    setRecords(result)
  }

  return (
    <PvChart
      records={records}
      type={type}
      onTypeChange={(type) => setType(type)}
    />
  )
}

export default PvChartContainer
