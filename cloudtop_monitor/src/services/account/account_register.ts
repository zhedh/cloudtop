import { ApiListData } from '../../types'
import { httpCatch } from '../../utils/http'

interface RegisterQuery {
  account: string
  password: string
  passwordConfirm: string
}

interface RegisterInfo {
  id: string
  account: string
}

export const accountRegister = (
  data: RegisterQuery
): ApiListData<RegisterInfo> => httpCatch.post('/account/register', data)
