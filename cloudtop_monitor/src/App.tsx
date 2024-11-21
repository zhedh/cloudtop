import { notification } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import { useLocation, useRoutes } from 'react-router-dom'
import routes from './routes'
import { NotificationContext, ProjectContext } from './store'
import { Project } from './types/project'
import { storageGet, storageSet } from './utils/storage'

declare const window: any

function App() {
  const location = useLocation()
  const [api, contextHolder] = notification.useNotification()
  const [project, setProject] = useState<Project>(
    (storageGet('PROJECT') || {}) as Project
  )

  useEffect(() => {
    window.cloudtop.routeChange(location.pathname)
    // cloudtop.routeChange(location.pathname)
  }, [location.pathname])

  const dispatchProject = useCallback((value: Project) => {
    setProject(value)
    storageSet('PROJECT', value)
  }, [])

  return (
    <ProjectContext.Provider value={[project, dispatchProject]}>
      <NotificationContext.Provider value={{ notification: api }}>
        {contextHolder}
        {useRoutes(routes)}
      </NotificationContext.Provider>
    </ProjectContext.Provider>
  )
}

export default App
