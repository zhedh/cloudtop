import { Form, Select, DatePicker } from 'antd'
import styled from 'styled-components'
// import { useState } from 'react'

const { RangePicker } = DatePicker

const APP_LIST = [
  {
    id: 1,
    name: 'cloudshop_corp',
  },
  {
    id: 2,
    name: 'cloudshop_admin',
  },
  {
    id: 3,
    name: 'cloudshop_system',
  },
]

const Search = () => {
  const [form] = Form.useForm()
  // const [query, setQuery] = useState({
  //   appName: APP_LIST[0].name,
  // })

  const handleValuesChange = (values: Record<string, unknown>) => {
    console.log('handleValuesChange: ', values)
  }

  return (
    <Wrapper>
      <Form
        layout="inline"
        form={form}
        initialValues={{ appName: APP_LIST[0].name }}
        onValuesChange={handleValuesChange}
        // onFinish={handleFinish}
      >
        <Form.Item label="" name="appName">
          <Select
            options={APP_LIST.map(({ id, name }) => ({
              label: name,
              value: id,
            }))}
            placeholder="请选择应用"
          />
        </Form.Item>
        <Form.Item label="" name="dateRange">
          <RangePicker />
        </Form.Item>
      </Form>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  margin: var(--margin);
  padding: 10px var(--padding);
  background-color: var(--light-color);
  border-radius: var(--border-radius);
`

export default Search
