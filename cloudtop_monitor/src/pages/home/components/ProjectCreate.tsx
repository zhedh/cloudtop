import { PlusOutlined } from '@ant-design/icons'
import { Button, Modal, Form, Radio, Input } from 'antd'
import styled from 'styled-components'
import { useContext, useState } from 'react'
import { PROJECT_TYPES } from '../../../constants/project'
import { createProject, CreateProjectData } from '../../../services/project'
import { NotificationContext } from '../../../store'
import { ProjectType } from '../../../types/project'
import React from 'react'

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

const ProjectCreate: React.FC<{ onCreate: () => void }> = React.memo(
  (props) => {
    const [visible, setVisible] = useState(false)
    const [form] = Form.useForm()
    const { notification } = useContext(NotificationContext)

    const handleOk = async () => {
      const values = await form.validateFields().catch(() => undefined)
      if (!values) return

      const { msg } = await createProject(values as CreateProjectData)

      notification.success({ message: '提示', description: msg })
      setVisible(false)
      form.resetFields()
      props.onCreate()
    }

    const handleCancel = () => {
      setVisible(false)
      form.resetFields()
    }

    return (
      <>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setVisible(true)}
        >
          创建应用
        </Button>
        <Modal
          title="新建项目"
          open={visible}
          onOk={handleOk}
          onCancel={handleCancel}
          okText="创建"
        >
          <Wrapper>
            <Form
              form={form}
              layout="vertical"
              initialValues={{
                projectType: ProjectType.WEB,
              }}
            >
              <Form.Item
                label="项目类型"
                name="projectType"
                rules={[{ required: true }]}
              >
                <Radio.Group options={PROJECT_TYPES} />
              </Form.Item>
              <Form.Item
                label="项目标识"
                name="projectCode"
                rules={[{ required: true }]}
              >
                <Input placeholder="请输入" />
              </Form.Item>
              <Form.Item
                label="项目名称"
                name="projectName"
                rules={[{ required: true }]}
              >
                <Input placeholder="请输入" />
              </Form.Item>
              {/* <Form.Item
                label={
                  <TeamLabel>
                    所属团队
                    <span>
                      没有团队？<a href="">立即创建</a>
                    </span>
                  </TeamLabel>
                }
                name="teamId"
                rules={[{ required: true }]}
              >
                <Select
                  options={TEAMS.map(({ id, name }) => ({
                    label: name,
                    value: id,
                  }))}
                  placeholder="请选择"
                />
              </Form.Item> */}
            </Form>
          </Wrapper>
        </Modal>
      </>
    )
  }
)

const Wrapper = styled.div`
  padding-top: 10px;

  .ant-form-item-label > label {
    width: 100%;
    color: var(--text-secondary-color);
  }
`

// const TeamLabel = styled.div`
//   display: flex;
//   justify-content: space-between;

//   width: 100%;
// `

export default ProjectCreate
