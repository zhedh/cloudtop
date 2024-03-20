import { Navigate, Outlet } from 'react-router-dom'
import {
  BarChartOutlined,
  HistoryOutlined,
  PieChartOutlined,
  WarningOutlined,
} from '@ant-design/icons'

import { CustomRoute } from './types'

import MonitorLayout from '../layouts/MonitorLayout'
import Overview from '../pages/dashboard/overview'
import Health from '../pages/dashboard/health'
import Performance from '../pages/dashboard/performance'
import Territory from '../pages/dashboard/territory'

import BehaviorDetail from '../pages/behavior/detail'
import BehaviorList from '../pages/behavior/list'

import JsError from '../pages/error/js'
import ResourceError from '../pages/error/resource'
import ApiError from '../pages/error/api/home'
import PerformancePageHome from '../pages/performance/page/home'
import PerformanceApiHome from '../pages/performance/api/home'

const monitorRoutes: CustomRoute[] = [
  {
    path: 'dashboard',
    element: <Outlet />,
    meta: {
      title: '仪表盘',
      icon: <PieChartOutlined />,
    },
    children: [
      {
        path: '',
        element: <Navigate to="overview" />,
      },
      {
        path: 'overview',
        element: <Overview />,
        meta: {
          title: '概览',
        },
      },
      {
        path: 'health',
        element: <Health />,
        meta: {
          title: '健康状况',
        },
      },
      {
        path: 'performance',
        element: <Performance />,
        meta: {
          title: '性能预览',
        },
      },
      {
        path: 'territory',
        element: <Territory />,
        meta: {
          title: '地域分布',
        },
      },
    ],
  },
  {
    path: 'behavior',
    element: <Outlet />,
    meta: {
      title: '用户行为',
      icon: <HistoryOutlined />,
    },
    children: [
      {
        path: 'list',
        element: <BehaviorList />,
        meta: {
          title: '用户列表',
        },
      },
      {
        path: 'detail/:id',
        element: <BehaviorDetail />,
      },
    ],
  },
  {
    path: 'error',
    element: <Outlet />,
    meta: {
      title: '异常统计',
      icon: <WarningOutlined />,
    },
    children: [
      {
        path: 'error',
        element: <JsError />,
        meta: {
          title: 'JS异常',
        },
      },
      {
        path: 'resource',
        element: <ResourceError />,
        meta: {
          title: '静态资源异常',
        },
      },
      {
        path: 'api',
        element: <Outlet />,
        meta: {
          title: '接口异常',
        },
        children: [
          {
            path: '',
            element: <ApiError />,
          },
        ],
      },
    ],
  },
  {
    path: 'performance',
    element: <Outlet />,
    meta: {
      title: '性能分析',
      icon: <BarChartOutlined />,
    },
    children: [
      {
        path: 'page',
        element: <Outlet />,
        meta: {
          title: '页面性能',
        },
        children: [
          {
            path: '',
            element: <Navigate to="/monitor/performance/page/home" />,
          },
          {
            path: 'home',
            element: <PerformancePageHome />,
          },
        ],
      },
      {
        path: 'api',
        element: <Outlet />,
        meta: {
          title: '接口性能',
        },
        children: [
          {
            path: '',
            element: <Navigate to="/monitor/performance/api/home" />,
          },
          {
            path: 'home',
            element: <PerformanceApiHome />,
          },
        ],
      },
    ],
  },
]

export default {
  path: 'monitor',
  element: <MonitorLayout />,
  children: monitorRoutes,
} as CustomRoute
