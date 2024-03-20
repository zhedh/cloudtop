import styled from 'styled-components'
import { Navigate, Outlet } from 'react-router-dom'
import SidebarContainer from './Sidebar'
import { useContext } from 'react'
import { ProjectContext } from '../../store'
import Header from '../components/Header'
import EnvFilter from './EnvFilter'

const Layout: React.FC = () => {
  const [project] = useContext(ProjectContext)

  if (!project.projectCode) return <Navigate to="/" />
  // PROJECT_ENVS

  return (
    <Main>
      <Header>
        <EnvFilter />
      </Header>
      <Wrapper>
        <SidebarContainer />
        <article>
          <Outlet />
        </article>
      </Wrapper>
    </Main>
  )
}

const Main = styled.main`
  position: relative;
`

const Wrapper = styled.div`
  position: relative;
  display: flex;
  z-index: 0;

  > article {
    height: 100vh;
    overflow-y: auto;
    box-sizing: border-box;
    padding-top: var(--header-height);
    flex: 1;
  }
`

export default Layout
