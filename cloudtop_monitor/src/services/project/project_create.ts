import { ApiResponse } from '../../types'
import { ProjectType } from '../../types/project'
import { httpCatch } from '../../utils/http'

export interface CreateProjectData {
  projectType: ProjectType
  projectCode: string
  projectName: string
  projectLogo: string
}

export const createProject = (
  data: CreateProjectData
): ApiResponse<{ id: number }> => httpCatch.post('/project/create', data)
