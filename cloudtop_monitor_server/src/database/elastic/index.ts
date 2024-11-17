import { createIndex } from './client'

export * from './client'
export * from './search'

export const initES = async () => {
  await createIndex()
  console.log('Elastic 初始化完成')
}