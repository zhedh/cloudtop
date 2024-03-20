import React, { useEffect, useState } from 'react'
import { Dayjs } from 'dayjs'
import styled from 'styled-components'
import Card from '../../../../../components/Card'
import { performancePageWaterfall } from '../../../../../services/performance'
import { ChartRecord } from '../../../../../types'
import WaterfallChart from './WaterfallChart'

interface Props {
  startTime: Dayjs
  endTime: Dayjs
}

function PageWaterfall(props: Props) {
  const { startTime, endTime } = props
  const [waterfall, setWaterfall] = useState<ChartRecord[]>([])

  useEffect(() => {
    getWaterfall()
  }, [startTime, endTime])

  const getWaterfall = async () => {
    const { result } = await performancePageWaterfall({
      startTime: startTime.format('YYYY-MM-DD HH:mm:ss'),
      endTime: endTime.format('YYYY-MM-DD HH:mm:ss'),
    })
    setWaterfall(result)
  }

  return (
    <Wrapper title="页面加载瀑布图">
      <WaterfallChart data={waterfall} />
    </Wrapper>
  )
}

const Wrapper = styled(Card)`
  margin: var(--margin);
`

export default React.memo(PageWaterfall)
