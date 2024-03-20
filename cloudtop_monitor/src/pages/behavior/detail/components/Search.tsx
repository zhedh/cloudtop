import { Form, DatePicker, TimePicker } from 'antd'
import styled from 'styled-components'
import React, { useEffect } from 'react'
import dayjs, { Dayjs } from 'dayjs'

export interface SearchParams {
  startTime: Dayjs
  endTime: Dayjs
}

interface Props {
  onSearch: (values: SearchParams) => void
}

interface FormValues {
  date: Dayjs
  time: Dayjs
  keyword: string
}

const Search: React.FC<Props> = (props) => {
  const [form] = Form.useForm()

  useEffect(() => {
    props.onSearch({
      startTime: dayjs().startOf('date'),
      endTime: dayjs().endOf('date'),
    })
  }, [])

  const handleValuesChange = (
    _: Record<string, unknown>,
    values: FormValues
  ) => {
    const { time } = values
    let { date } = values

    if (!date) date = dayjs()

    let startTime = date.startOf('date')
    let endTime = date.endOf('date')

    if (time) {
      const currentTime = dayjs(
        date.format('YYYY-MM-DD') + ' ' + time.format('HH')
      )
      startTime = currentTime.startOf('hour')
      endTime = currentTime.endOf('hour')
    }

    props.onSearch({
      startTime,
      endTime,
    })
  }

  return (
    <Wrapper>
      <span>用户详情</span>
      <Form layout="inline" form={form} onValuesChange={handleValuesChange}>
        <Form.Item label="日期" name="date">
          <DatePicker
            disabledDate={(date) => date > dayjs()}
            allowClear
            placeholder="今天"
          />
        </Form.Item>
        <Form.Item label="时间" name="time">
          <TimePicker
            disabledDate={(time) => {
              return time > dayjs()
            }}
            allowClear
            showNow={false}
            format="HH"
            placeholder="今天"
          />
        </Form.Item>
      </Form>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding: 12px var(--padding);
  border-radius: var(--border-radius);
  background-color: var(--light-color);

  > span {
    color: var(--text-secondary-color);
    font-size: 16px;
  }

  .ant-form-item {
    margin-inline-start: 16px;
    margin-inline-end: 0;
    padding-left: 10px;

    .ant-form-item-label > label {
      color: var(--text-tertiary-color);
    }
  }
`

export default Search
