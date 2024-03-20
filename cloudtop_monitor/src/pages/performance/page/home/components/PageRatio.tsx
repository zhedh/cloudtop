import { Dayjs } from 'dayjs'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import {
  PerformancePageRadioData,
  performancePageRadio,
} from '../../../../../services/performance'
import RatioChart from './RatioChart'

interface Props {
  startTime: Dayjs
  endTime: Dayjs
}

function PageRatio(props: Props) {
  const { startTime, endTime } = props
  const [networkData, setNetworkData] = useState<PerformancePageRadioData>({
    total: 0,
    records: [],
  })
  const [browserData, setBrowserData] = useState<PerformancePageRadioData>({
    total: 0,
    records: [],
  })

  useEffect(() => {
    getRatioData('ct').then((result) => setNetworkData(result))
    getRatioData('browser').then((result) => setBrowserData(result))
  }, [startTime, endTime])

  const getRatioData = async (fieldType: 'ct' | 'browser') => {
    const { result } = await performancePageRadio({
      fieldType: fieldType,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
    })

    return result
  }

  return (
    <Wrapper>
      <article>
        <RatioChart title="网络类型" data={networkData} />
        <RatioChart title="浏览器类型" data={browserData} />
      </article>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  margin: var(--margin);

  > article {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-column-gap: var(--margin);
  }
`

export default React.memo(PageRatio)
