import geoip from 'geoip-lite'
import IP2Region from 'ip2region'
import { CITY_MAP, REGION_MAP } from './city'

const query = new IP2Region()

const getMunicipalitiesCityKey = (regionKey: string) => {
  switch (regionKey) {
    case 'BJ':
      return 'Beijing'
    case 'SH':
      return 'Shanghai'
    case 'TJ':
      return 'Tianjin'
    case 'CQ':
      return 'Chongqing'
    default:
      return ''
  }
}

export const ipLocation = (ip: string) => {
  if (ip.includes('::ffff:')) ip = ip.replace('::ffff:', '')

  const geo = geoip.lookup(ip) // 获取位置信息
  const geoExp = query.search(ip) // 补充获取运营商

  if (!geo)
    return {
      ipIsp: geoExp?.isp ?? '',
      ipCountry: '',
      ipCountryId: '',
      ipRegion: '',
      ipRegionId: '',
      ipCity: '',
      ipCityId: '',
      remoteAddr: ip,
    }

  const region = REGION_MAP[geo.region]
  const city = CITY_MAP[geo.city || getMunicipalitiesCityKey(geo.region)]

  if (geo.country !== 'CN') {
    return {
      ipIsp: '',
      ipCountry: geo.country,
      ipCountryId: geo.country,
      ipRegion: geo.region,
      ipRegionId: geo.region,
      ipRegionName: geo.region,
      ipCity: geo.city,
      ipCityId: geo.city,
      ipCityName: geo.city,
      remoteAddr: ip,
    }
  }

  return {
    ipIsp: geoExp?.isp ?? '',
    ipCountry: geo.country === 'CN' ? '中国' : geo.country,
    ipCountryId: geo.country,
    ipRegion: region?.name,
    ipRegionId: String(region?.id ?? ''),
    ipRegionName: region?.ext_name,
    ipCity: city?.name,
    ipCityId: String(city?.id ?? ''),
    ipCityName: city?.ext_name,
    remoteAddr: ip,
  }
}
