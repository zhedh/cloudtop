import sha1 from 'sha1'

/**
 * 值初始化后不要修改，修改会导致加密验证失败
 */
const SHA1_SALT =
  import.meta.env.VITE_SHA1_SALT + '0fbf5b59a36ce107ae19caee2eea20cf'

export const cryptoSha1 = (message: string) => sha1(message + SHA1_SALT)
