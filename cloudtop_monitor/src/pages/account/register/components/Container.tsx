import styled from 'styled-components'
import ACCOUNT_BG from '../../../../assets/account_bg.png'
import { Button, Form, Input } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { Link } from 'react-router-dom'
import { cryptoSha1 } from '../../../../utils/crypto'
import { accountRegister } from '../../../../services/account'

function Register() {
  const [form] = useForm()

  const handleSubmit = async (values: Record<string, any>) => {
    console.log(values)

    // cryptoSha1()
    const { result } = await accountRegister({
      account: values.account,
      password: cryptoSha1(values.password),
      passwordConfirm: cryptoSha1(values.passwordConfirm),
    })

    console.log('result: ', result)
  }

  return (
    <Wrapper>
      <Box>
        <h1>账号注册</h1>
        <Form
          form={form}
          size="middle"
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            label="邮箱"
            name="account"
            rules={[
              { required: true, message: '请输入邮箱！' },
              {
                type: 'email',
                message: '输入的电子邮件无效！',
              },
            ]}
          >
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item
            label="密码"
            name="password"
            rules={[
              { required: true, message: '请输入密码！' },
              { min: 8, max: 16, message: '请输入8-16位密码！' },
            ]}
          >
            <Input type="password" placeholder="请输入" />
          </Form.Item>
          <Form.Item
            label="确认密码"
            name="passwordConfirm"
            rules={[
              { required: true, message: '请再次输入密码！' },
              { min: 8, max: 16, message: '请输入8-16位密码！' },
            ]}
          >
            <Input type="password" placeholder="请输入" />
          </Form.Item>
          {/* <Form.Item
            label="邮箱验证码"
            name="code"
            rules={[{ required: true, message: '请再次输入密码！' }]}
          >
            <Input
              placeholder="请输入"
              addonAfter={<span className="send">发送</span>}
            />
          </Form.Item> */}
          <br />
          <Form.Item>
            <Button className="login-button" type="primary" htmlType="submit">
              注册
            </Button>
            <p className="aside">
              &nbsp;
              <Link to="/account/login">登录</Link>
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
  width: 400px;
  padding: 30px 30px 0;
  border-radius: var(--border-radius);
  background-color: var(--light-color);

  h1 {
    margin-top: 0;
    margin-bottom: 20px;
    text-align: center;
    font-size: 20px;
    color: var(--primary-color);
  }

  .send {
    cursor: pointer;
  }

  .login-button {
    width: 100%;
  }

  .aside {
    display: flex;
    justify-content: space-between;
  }
`

export default Register
