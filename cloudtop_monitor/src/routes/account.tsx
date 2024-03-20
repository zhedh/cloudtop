import { Outlet } from 'react-router-dom'
import { CustomRoute } from './types'
import Login from '../pages/account/login'
import Register from '../pages/account/register'

const accountRoutes: CustomRoute[] = [
  {
    path: 'login',
    element: <Login />,
  },
  {
    path: 'register',
    element: <Register />,
  },
]

export default {
  path: 'account',
  element: <Outlet />,
  children: accountRoutes,
} as CustomRoute
