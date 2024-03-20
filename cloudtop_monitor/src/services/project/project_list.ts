import { ApiListData } from '../../types'
import { Project, ProjectType } from '../../types/project'
import { httpCatch } from '../../utils/http'

export interface QueryProjectParams {
  projectType?: ProjectType
  projectCode?: string
  projectName?: string
}

export const queryProjectList = (
  data: QueryProjectParams
): ApiListData<Project> => httpCatch.post('/project/list', data)
