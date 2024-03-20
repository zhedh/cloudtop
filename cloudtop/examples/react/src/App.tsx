import { useLocation, useRoutes } from 'react-router-dom'
import router from './router'
import { useEffect } from 'react'
import cloudtop from './cloudtop'

function App() {
  const location = useLocation()

  useEffect(() => {
    cloudtop.routeChange(location.pathname)
  }, [location.pathname])


  return useRoutes(router)
}

export default App