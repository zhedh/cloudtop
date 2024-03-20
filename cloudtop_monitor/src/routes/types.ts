import { ReactNode } from 'react'
import { IndexRouteObject, NonIndexRouteObject } from 'react-router-dom'

export interface RouteMeta {
  title?: string
  icon?: ReactNode
}

interface IndexRoute extends IndexRouteObject {
  meta?: RouteMeta
}

interface NonIndexRoute extends NonIndexRouteObject {
  meta?: RouteMeta
  children?: NonIndexRoute[]
}

export type CustomRoute = IndexRoute | NonIndexRoute
