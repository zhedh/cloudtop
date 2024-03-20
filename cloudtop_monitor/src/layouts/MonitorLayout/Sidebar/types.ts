import { RouteMeta } from '../../../routes/types'

export interface Nav {
  path?: string
  fullPath?: string
  children?: Nav[]
  meta?: RouteMeta
}
