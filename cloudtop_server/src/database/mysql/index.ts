import { Log } from '../../schemas'

// 数据库初始化方法
async function initDB() {
  await Log.sync({ alter: true })
  // await Project.sync({ alter: true })

  console.log('Mysql 初始化完成')
}

// 导出初始化方法和模型
export { initDB }
