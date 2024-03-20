import styled from 'styled-components'
import { Nav } from './types'
import { useLocation, useNavigate } from 'react-router-dom'

const Sidebar: React.FC<{ navs: Nav[] }> = (props) => {
  const navigator = useNavigate()
  const { pathname } = useLocation()

  const handleGo = (e: React.MouseEvent, pathname: string) => {
    navigator(pathname)
    e.preventDefault()
  }

  return (
    <Wrapper>
      {props.navs.map((nav) => (
        <nav
          key={nav.fullPath}
          className={pathname.startsWith(nav.fullPath!) ? 'active' : ''}
        >
          <span>
            {nav.meta?.icon}
            {nav.meta?.title}
          </span>
          <ul>
            {(nav.children ?? []).map((subNav) => (
              <li
                key={subNav.fullPath}
                className={
                  pathname.startsWith(subNav.fullPath!) ? 'active' : ''
                }
                onClick={(e) => handleGo(e, subNav.fullPath!)}
              >
                {subNav.meta?.title}
              </li>
            ))}
          </ul>
        </nav>
      ))}
    </Wrapper>
  )
}

const Wrapper = styled.aside`
  flex-shrink: 0;
  box-sizing: border-box;
  width: var(--sidebar-width);
  padding-top: var(--header-height);
  height: 100vh;
  overflow-y: auto;

  background-color: var(--light-color);
  box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.1);

  > nav {
    margin: 20px 0;
    color: var(--text-secondary-color);
    cursor: pointer;

    > span {
      display: flex;
      align-items: center;
      height: 50px;
      padding: 0 var(--padding);
      font-size: 16px;

      svg {
        margin-right: 12px;
      }
    }

    &.active > span {
      color: var(--primary-color);
    }

    > ul {
      margin: 0;
      padding: 0;
      list-style: none;

      li {
        padding: 10px 20px 10px 46px;

        &.active {
          border-right: 4px solid var(--primary-color);
          background-color: var(--background-primary-color);
          color: var(--primary-color);
        }
      }
    }
  }
`

export default Sidebar
