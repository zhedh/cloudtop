import { Form, Select, Input } from 'antd'
import styled from 'styled-components'
import { SearchOutlined } from '@ant-design/icons'
import { PROJECT_ENVS, PROJECT_TYPES } from '../../../constants/project'
import React, { useCallback, useEffect } from 'react'
import { QueryProjectParams } from '../../../services/project'
import ProjectCreate from './ProjectCreate'
import { ProjectEnv } from '../../../types/project'

interface Props {
  onSearch: (values: QueryProjectParams) => void
}

// const TEAMS = [
//   {
//     id: 2,
//     name: '云店',
//   },
//   {
//     id: 3,
//     name: '爱门店',
//   },
// ]

const INITIAL_VALUES = {
  projectEnv: ProjectEnv.PRODUCTION,
}

const Search: React.FC<Props> = (props) => {
  const [form] = Form.useForm()

  useEffect(() => {
    props.onSearch(INITIAL_VALUES)
  }, [])

  const handleCreate = useCallback(() => {
    props.onSearch(INITIAL_VALUES)
  }, [])

  const handleValuesChange = (
    _: Record<string, unknown>,
    values: QueryProjectParams
  ) => {
    props.onSearch(values)
  }

  return (
    <Wrapper>
      <ProjectCreate onCreate={handleCreate} />
      <Form
        layout="inline"
        initialValues={INITIAL_VALUES}
        form={form}
        onValuesChange={handleValuesChange}
      >
        {/* <Form.Item label="团队" name="teamId">
          <Select
            variant="borderless"
            options={TEAMS.map(({ id, name }) => ({
              label: name,
              value: id,
            }))}
            placeholder="请选择团队"
            allowClear
          />
        </Form.Item> */}
        <Form.Item label="环境" name="projectEnv">
          <Select
            variant="borderless"
            options={PROJECT_ENVS}
            placeholder="请选择环境"
            allowClear
          />
        </Form.Item>
        <Form.Item label="应用类型" name="projectType">
          <Select
            variant="borderless"
            options={PROJECT_TYPES}
            placeholder="请选择应用"
            allowClear
          />
        </Form.Item>
        <Form.Item name="projectName">
          <Input
            variant="borderless"
            placeholder="请输入应用名称"
            suffix={<SearchOutlined color="var(--text-tertiary-color)" />}
            allowClear
          />
        </Form.Item>
      </Form>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin: var(--margin);

  .ant-form-item {
    margin-inline-start: 16px;
    margin-inline-end: 0;
    padding-left: 10px;
    background-color: var(--light-color);
    border-radius: var(--border-radius);

    .ant-form-item-label > label {
      color: var(--text-tertiary-color);
    }
  }
`

export default Search
