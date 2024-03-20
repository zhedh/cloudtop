import { Dayjs } from 'dayjs'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import {
  PerformanceApiTerminalRecord,
  performanceApiTerminal,
} from '../../../../../services/performance'
import TerminalChart from './TerminalChart'

interface Props {
  startTime: Dayjs
  endTime: Dayjs
}

function ApiTerminal(props: Props) {
  const { startTime, endTime } = props
  const [networkData, setNetworkData] = useState<
    PerformanceApiTerminalRecord[]
  >([])
  const [browserData, setBrowserData] = useState<
    PerformanceApiTerminalRecord[]
  >([])

  useEffect(() => {
    getTerminalData('ct').then((result) => setNetworkData(result))
    getTerminalData('browser').then((result) => setBrowserData(result))
  }, [startTime, endTime])

  const getTerminalData = async (terminalType: 'ct' | 'browser') => {
    const { result } = await performanceApiTerminal({
      terminalType: terminalType,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
    })

    return result
  }

  return (
    <Wrapper>
      <article>
        <TerminalChart title="网络类型" data={networkData} />
        <TerminalChart title="浏览器类型" data={browserData} />
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

export default React.memo(ApiTerminal)
