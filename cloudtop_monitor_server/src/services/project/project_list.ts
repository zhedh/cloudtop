import { Op } from 'sequelize'
import { Project } from '../../schemas/project'
import { ProjectType } from '../../types/project'
import { ApiData } from '../../utils/response'
import { PaginationParams } from '../../types'

export interface ProjectQueryData extends PaginationParams {
  projectType?: ProjectType
  teamId?: string
  projectName?: string
}

export const projectList = async (data: ProjectQueryData) => {
  const { projectType, teamId, projectName, pageSize = 20, current = 1 } = data
  const query: Record<string, any> = {
    delStatus: 0,
  }

  if (projectType) {
    query.projectType = projectType
  }

  if (projectName) {
    query.projectName = {
      [Op.like]: '%' + projectName + '%',
    }
  }

  if (teamId) {
    query.teamId = teamId
  }

  const projects = await Project.findAndCountAll({
    where: query,
    limit: pageSize,
    offset: (current - 1) * pageSize,
  })

  return new ApiData(0, '查询项目列表成功', {
    records: projects.rows,
    pagination: {
      current,
      pageSize,
      total: projects.count,
    },
  })
}
