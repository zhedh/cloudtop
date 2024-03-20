import { Project } from '../../schemas/project'
import { ProjectType } from '../../types/project'
import { ApiData, ApiError } from '../../utils/response'

export interface ProjectCreateData {
  projectType: ProjectType
  projectCode: string
  projectName: string
  projectLogo: string
}

export const projectCreate = async (data: ProjectCreateData) => {
  // return new ApiData(0, '项目创建成功', {
  //   id: 3,
  // })

  let project = await Project.findOne({
    where: { projectCode: data.projectCode },
  })

  if (project) {
    const { projectCode, projectName } = project.toJSON()
    throw new ApiError(400100, 'projectCode 已被占用，请修改后重试', {
      projectCode,
      projectName,
    })
  }

  project = await Project.create({
    projectType: data.projectType,
    projectCode: data.projectCode,
    projectName: data.projectName,
    projectLogo: data.projectLogo,
    userId: '', // TODO 项目负责人
    delStatus: 0,
    status: 0,
  })

  return new ApiData(0, '项目创建成功', project.toJSON())
}
