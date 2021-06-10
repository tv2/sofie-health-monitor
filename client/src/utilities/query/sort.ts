import { QuerySortOption } from './tokens'
import { getRundown } from './utilities'

const rateStatus = (status: string) => {
  const lcStatus = status.toLowerCase()

  if ('ok'.includes(lcStatus)) return 0
  if ('warning'.includes(lcStatus)) return 1
  if ('fail'.includes(lcStatus)) return 2
  return 100
}

const extractHostData = (options: QuerySortOption) => (host: any) => {
  switch (options.strategy) {
    case 'status': return rateStatus(host.state.health.status)
    case 'rundown': return getRundown(host).status || ''
    case 'name': return {
      str: host.name.replace(/[0-9]/g, ''),
      dig: parseInt(host.name.replace(/[^0-9]/g, '') || '0', 10)
    }
    default: return host
  }
}

const sortHostData = (options: QuerySortOption) => (data1: any, data2: any) => {
  switch (options.strategy) {
    case 'name': return data1.str == data2.str ? (data1.dig > data2.dig ? 1 : -1) : (data1.str > data2.str ? 1 : -1)
    default: return data1 === data2 ? 0 : data1 > data2 ? 1 : -1
  }
}

export const sort = (options: QuerySortOption) => (host1: any, host2: any) => {
  const data1 = extractHostData(options)(host1)
  const data2 = extractHostData(options)(host2)
  const order = sortHostData(options)(data1, data2)
  return (options.asc_order ? 1 : -1) * order
}
