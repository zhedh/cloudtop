import dayjs from 'dayjs'

export const print = (...data: any) => {
  const time = dayjs().format('YYYY-MM-DD HH:mm:ss')
  console.log(time + '$ ', ...data)
}
