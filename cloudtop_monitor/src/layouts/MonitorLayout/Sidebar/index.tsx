import Sidebar from './Sidebar'
import monitor from '../../../routes/monitor'
import { CustomRoute } from '../../../routes/types'
import { Nav } from './types'

const SidebarContainer: React.FC = () => {
  const transformNav = (router: CustomRoute, paths: string[] = []): Nav => {
    const { children, path, meta } = router

    paths = [...paths, path ?? '']

    return {
      path,
      meta,
      fullPath: '/' + paths.map((p) => p?.replace('/', '')).join('/'),
      children: children
        ?.filter((r) => r.meta?.title)
        .map((r) => transformNav(r, paths)),
    }
  }

  const { children: NAV_LIST } = transformNav(monitor)

  return <Sidebar navs={NAV_LIST ?? []} />
}

export default SidebarContainer
