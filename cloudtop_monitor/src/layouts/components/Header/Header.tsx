import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

const Header = (props: React.PropsWithChildren) => {
  const navigator = useNavigate()

  return (
    <Wrapper>
      <Title>Cloudtop Monitor</Title>
      <Actions>
        {props.children}
        <ul>
          <li onClick={() => navigator('/')}>首页</li>
          <li>概览</li>
          <li>用户</li>
        </ul>
      </Actions>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;

  height: var(--header-height);
  box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.1);
  background-color: var(--light-color);
`

const Title = styled.div`
  box-sizing: border-box;
  width: var(--sidebar-width);
  padding: 0 var(--padding);
  color: var(--primary-color);
  font-weight: 600;
  font-size: 18px;
`

const Actions = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;

  ul {
    display: flex;
    margin: 0;
    padding: 0;
    list-style: none;

    li {
      padding: 0 var(--padding);
      cursor: pointer;
    }
  }
`

export default Header
