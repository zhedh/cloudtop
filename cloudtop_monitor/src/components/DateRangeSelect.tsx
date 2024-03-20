import { CalendarOutlined } from '@ant-design/icons'
import { DatePicker } from 'antd'
import dayjs, { Dayjs } from 'dayjs'
import React from 'react'
import styled from 'styled-components'

const { RangePicker } = DatePicker

interface Props {
  value: [Dayjs, Dayjs]
  onChange: (value: [Dayjs, Dayjs]) => void
}

const Component: React.FC<Props> = (props) => {
  const [startDate, endDate] = props.value
  const days = endDate.diff(startDate, 'day') + 1

  return (
    <Wrapper>
      <aside>
        <label>时间范围：</label>
        <CalendarOutlined />
        <span>{days}天</span>
      </aside>
      <RangePicker
        allowClear={false}
        value={props.value}
        disabledDate={(date) => date > dayjs()}
        onChange={(value) => props.onChange((value ?? []) as [Dayjs, Dayjs])}
      />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* margin-bottom: var(--padding); */

  > aside {
    display: flex;
    align-items: center;

    label {
      font-size: 16px;
      font-weight: bold;
    }

    svg {
      color: var(--error-color);
      font-size: 16px;
    }

    span {
      margin-left: 5px;
      color: var(--text-secondary-color);
    }
  }
`

const DateRangeSelect = React.memo(Component)
export default DateRangeSelect
