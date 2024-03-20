import { ProjectEnv, ProjectType } from '../types/project'

export const PROJECT_TYPES = [
  {
    label: 'Web项目',
    value: ProjectType.WEB,
  },
  {
    label: '微信小程序',
    value: ProjectType.MINI,
  },
]

export const PROJECT_ENVS = [
  {
    label: '生产环境',
    value: ProjectEnv.PRODUCTION,
  },
  {
    label: '预发环境',
    value: ProjectEnv.STAGING,
  },
  {
    label: '测试环境',
    value: ProjectEnv.TESTING,
  },
  {
    label: '开发环境',
    value: ProjectEnv.DEVELOPMENT,
  },
]
