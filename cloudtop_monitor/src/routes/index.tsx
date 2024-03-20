import Home from '../pages/home'
import Contact from '../pages/contact'
import MainLayout from '../layouts/MainLayout'
import account from './account'
import monitor from './monitor'

const mainRoutes = [
  // {
  //   path: '',
  //   element: <Home />,
  // },

  {
    path: '',
    element: <Home />,
  },
  // {
  //   path: 'about',
  //   element: <About />,
  // },
]

const routes = [
  {
    path: '/',
    element: <MainLayout />,
    children: mainRoutes,
  },
  account,
  monitor,
  {
    path: '/contact',
    element: <Contact />,
  },
]

export default routes
