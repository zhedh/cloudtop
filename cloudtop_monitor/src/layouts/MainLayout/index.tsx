import styled from 'styled-components'
import Header from '../components/Header'
import { Outlet } from 'react-router-dom'

const Layout: React.FC = () => {
  return (
    <Wrapper>
      <Header />
      <Outlet />
    </Wrapper>
  )
}

const Wrapper = styled.main`
  position: relative;
`

export default Layout
