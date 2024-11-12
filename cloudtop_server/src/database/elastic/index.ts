import { createIndex } from './client'

export const initES = async () => {
  await createIndex()
  console.log('Elastic 初始化完成')
}