import styled from 'styled-components'
import ACCOUNT_BG from '../../../../assets/account_bg.png'
import { Button, Form, Input } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'

function Login() {
  const [form] = useForm()

  return (
    <Wrapper>
      <Box>
        <h1>账号登录</h1>
        <Form
          form={form}
          size="middle"
          initialValues={{
            account: '',
            password: '',
          }}
        >
          <Form.Item
            // label="账号"
            name="account"
            rules={[{ required: true, message: '请输入账号！' }]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="请输入"
            />
          </Form.Item>
          <Form.Item
            // label="密码"
            name="password"
            rules={[{ required: true, message: '请输入密码！' }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="请输入"
            />
          </Form.Item>
          <br />
          <Form.Item>
            <Button className="login-button" type="primary" htmlType="submit">
              登录
            </Button>
            <p className="aside">
              <a href="">忘记密码</a>
              <Link to="/account/register">注册</Link>
            </p>
          </Form.Item>
        </Form>
      </Box>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: row-reverse;
  width: 100vw;
  height: 100vh;
  background-image: url(${ACCOUNT_BG});
  background-size: cover;
`

const Box = styled.div`
  position: relative;
  right: 15%;
  box-sizing: border-box;
  width: 360px;
  padding: 30px;
  border-radius: var(--border-radius);
  background-color: var(--light-color);

  h1 {
    margin-top: 0;
    margin-bottom: 20px;
    text-align: center;
    font-size: 20px;
    color: var(--primary-color);
  }

  .login-button {
    width: 100%;
  }

  .aside {
    display: flex;
    justify-content: space-between;
  }
`

export default Login
