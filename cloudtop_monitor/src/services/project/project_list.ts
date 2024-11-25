import { ApiListData } from '../../types'
import { Project, ProjectEnv, ProjectType } from '../../types/project'
import { httpCatch } from '../../utils/http'

export interface QueryProjectParams {
  projectType?: ProjectType
  projectEnv?: ProjectEnv
  projectCode?: string
  projectName?: string
}

export const queryProjectList = (
  data: QueryProjectParams
): ApiListData<Project> => httpCatch.post('/project/list', data)
