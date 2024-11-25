import Cloudtop from 'cloudtop'

const cloudtop = new Cloudtop({
  // baseURL: 'https://cloudtop-server-staging.retailaim.com',
  baseURL: 'http://localhost:3000',
  projectId: 'cloudtop_demo',
  env: 'development',
  reportType: 'beacon',
})

export default cloudtop
