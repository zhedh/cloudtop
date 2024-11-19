import { User, Project, Log } from '../../schemas'

// 数据库初始化方法
async function initDB() {
  // await User.sync({ alter: true })
  // await Project.sync({ alter: true })
  // await Log.sync({ alter: true })
}

// 导出初始化方法和模型
export { initDB }
