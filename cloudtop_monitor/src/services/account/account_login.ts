import { ApiListData } from '../../types'
import { httpCatch } from '../../utils/http'

interface LoginQuery {
  account: string
  password: string
}

interface LoginInfo {
  token: string
}

export const accountLogin = (data: LoginQuery): ApiListData<LoginInfo> =>
  httpCatch.post('/account/login', data)
