export enum ProjectType {
  WEB = 'web',
  MINI = 'mini',
}

export enum ProjectEnv {
  PRODUCTION = 'production',
  STAGING = 'staging',
  TESTING = 'testing',
  DEVELOPMENT = 'development',
}

export enum ProjectStatus {
  INACTIVE = 0,
  ACTIVE = 1,
  DISABLED = 2,
}

export interface Project {
  createdAt: string
  updatedAt: string
  id: number
  projectType: ProjectType
  projectCode: string
  projectEnv?: string
  projectName: string
  projectLogo?: string
  userId?: string
  status: ProjectStatus //状态 0=未激活 1=已激活 2=禁用
}
