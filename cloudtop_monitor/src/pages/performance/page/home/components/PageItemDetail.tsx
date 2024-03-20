import { Drawer } from 'antd'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import WaterfallChart from './WaterfallChart'
import {
  PerformancePageListRecord,
  performancePageWaterfall,
} from '../../../../../services/performance'
import { Dayjs } from 'dayjs'
import { ChartRecord } from '../../../../../types'

interface Props {
  visible: boolean
  record: PerformancePageListRecord
  startTime: Dayjs
  endTime: Dayjs
  onClose: () => void
}

function PageItemDetail(props: Props) {
  const { record, startTime, endTime } = props
  const [waterfall, setWaterfall] = useState<ChartRecord[]>([])

  useEffect(() => {
    getWaterfall()
  }, [record, startTime, endTime])

  const getWaterfall = async () => {
    const { result } = await performancePageWaterfall({
      page: record.page,
      startTime: startTime.format('YYYY-MM-DD HH:mm:ss'),
      endTime: endTime.format('YYYY-MM-DD HH:mm:ss'),
    })
    setWaterfall(result)
  }

  const renderElapsedTime = (elapsedTime: number, fixed = 2) => {
    if (elapsedTime >= 1000) {
      return (
        <span>
          {(elapsedTime / 1000).toFixed(fixed)}
          <small>s</small>
        </span>
      )
    }

    return (
      <span>
        {elapsedTime?.toFixed(fixed)}
        <small>ms</small>
      </span>
    )
  }

  return (
    <Drawer
      title="详情信息"
      placement="right"
      width="70%"
      closable={false}
      onClose={props.onClose}
      open={props.visible}
    >
      <Wrapper>
        <section>
          <h4>摘要信息</h4>
          <Description>
            <label>页面URL</label>
            <a>{record.page}</a>
          </Description>
          <Description>
            <label>采样数</label>
            <a>{record.count}</a>
          </Description>
        </section>
        <section>
          <h4>页面性能关键指标</h4>
          <Indicator>
            <li>
              <label>首字节</label>
              {renderElapsedTime(record.ttfb)}
            </li>
            <li>
              <label>DOM Ready</label>
              {renderElapsedTime(record.ready)}
            </li>
            <li>
              <label>页面完全加载</label>
              {renderElapsedTime(record.load)}
            </li>
          </Indicator>
        </section>
        <section>
          <h4>页面加载瀑布图</h4>
          <WaterfallChart data={waterfall} />
        </section>
      </Wrapper>
    </Drawer>
  )
}

const Wrapper = styled.div`
  section {
    margin-bottom: 30px;
  }
`

const Description = styled.div`
  margin: 10px 0;

  label {
    display: inline-block;
    width: 100px;
    color: var(--text-secondary-color);
  }
`

const Indicator = styled.ul`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-column-gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;

  > li {
    display: flex;
    flex-direction: column;
    padding: var(--padding);
    border-radius: var(--border-radius);
    background-color: var(--background-color);

    label {
      color: var(--text-secondary-color);
    }

    span {
      font-size: 28px;
      font-weight: bold;

      small {
        font-size: 14px;
        font-weight: normal;
      }
    }
  }
`

export default React.memo(PageItemDetail)
