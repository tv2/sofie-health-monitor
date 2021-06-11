import { QuerySortOption } from './tokens'
import { getRundown } from './utilities'

const rateStatus = (status: string) => {
  const lcStatus = status.toLowerCase()

  if ('ok'.includes(lcStatus)) return 0
  if ('warning'.includes(lcStatus)) return 1
  if ('fail'.includes(lcStatus)) return 2
  return 100
}

const rateRundown = (rundown: any) => {
  // Determine string representation
  const lcRundown = rundown.active ? (rundown.rehearsal ? 'rehearsal' : 'active') : 'inactive'

  switch (lcRundown) {
    case 'inactive': return 0
    case 'rehearsal': return 1
    case 'active': return 2
    default: return 100
  }
  if ('inactive'.includes(lcRundown)) return 0
  if ('rehearsal'.includes(lcRundown)) return 1
  if ('active'.includes(lcRundown)) return 2
  return 100
}

const extractHostData = (options: QuerySortOption) => (host: any) => {
  switch (options.strategy) {
    case 'status': return rateStatus(host.state.health.status)
    case 'rundown': return rateRundown(getRundown(host))
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

export const sort = (options: QuerySortOption[]) => (host1: any, host2: any): number => {
  const [option, ..._options] = options
  const data1 = extractHostData(option)(host1)
  const data2 = extractHostData(option)(host2)
  const order = sortHostData(option)(data1, data2)
  if (_options.length && order === 0) {
    return sort(_options)(host1, host2)
  } else {
    return (option.asc_order ? 1 : -1) * order
  }
}
