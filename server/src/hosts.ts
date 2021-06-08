export interface HostDefinition {
  name: string,
  endpoints: {
    health: string,
    rundown: string,
  },
}

const hosts = require('../../data/hosts.json')

export default hosts as HostDefinition[]
