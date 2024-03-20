import * as React from 'react'
import { Project } from '../types/project'

type ProjectDispatch = (project: Project) => void

export const ProjectContext = React.createContext<[Project, ProjectDispatch]>([
  {} as Project,
  (project: Project) => console.log(project),
])
