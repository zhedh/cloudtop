import cityData from '../lib/city_data'

const pinyinToKey = (pinyin: string) =>
  pinyin
    .split(' ')
    .join('')
    .replace(/^[a-zA-Z]/, pinyin[0].toUpperCase())

const pinyinToShorthand = (pinyin: string) =>
  pinyin
    .split(' ')
    .map((i) => i[0].toUpperCase())
    .join('')

const listToMap = (list: Record<string, string>[]) => {
  const region: Record<string, any> = {}
  const city: Record<string, any> = {}

  list.forEach((item) => {
    const { pinyin, id } = item

    if (id.length <= 2) {
      const k = pinyinToShorthand(pinyin)
      region[k] = item
      return
    }

    if (id.length <= 4) {
      const k = pinyinToKey(pinyin)
      city[k] = item
      return
    }
  })

  return [region, city]
}

export const [REGION_MAP, CITY_MAP] = listToMap(cityData)

export const CITY_DATA = cityData
