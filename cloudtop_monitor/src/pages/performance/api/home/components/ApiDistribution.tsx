import React, { useEffect, useState } from 'react'
import { Dayjs } from 'dayjs'
import styled from 'styled-components'
import Card from '../../../../../components/Card'
import { performanceApiDistribution } from '../../../../../services/performance'
import { ChartRecord } from '../../../../../types'
import DistributionChart from './DistributionChart'

interface Props {
  startTime: Dayjs
  endTime: Dayjs
}

function ApiDistribution(props: Props) {
  const { startTime, endTime } = props
  const [distribution, setDistribution] = useState<ChartRecord[]>([])
  const interval = 5

  useEffect(() => {
    getWaterfall()
  }, [startTime, endTime])

  const getWaterfall = async () => {
    const { result } = await performanceApiDistribution({
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      interval: interval,
    })
    setDistribution(result)
  }

  return (
    <Wrapper title="接口耗时分布图">
      <DistributionChart data={distribution} interval={interval} />
    </Wrapper>
  )
}

const Wrapper = styled(Card)`
  margin: var(--margin);
`

export default React.memo(ApiDistribution)
