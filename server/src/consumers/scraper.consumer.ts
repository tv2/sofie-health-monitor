import { EventConsumer, ConsumerEvent } from '../lib/events'
import { HostDefinition } from '../hosts'
import fetch from 'node-fetch'
import moment from 'moment'

interface ScraperConsumerParameters {
  interval: number
}

export class ScraperConsumer extends EventConsumer {
  private hosts: HostDefinition[]
  private timer: NodeJS.Timeout | null
  private interval: number

  constructor({ interval }: ScraperConsumerParameters) {
    super()
    this.hosts = []
    this.timer = null
    this.interval = interval
  }

  consume({ event, data, emit }: ConsumerEvent) {
    if (event == 'hosts-registered') {
      this.hosts = data
      this.timer = setInterval(() => emit('scrape'), this.interval)
      this.info('initial setup with hosts:\n ', this.hosts.map((host: any) => host.name).join('\n  '))
    }
    this.scrape(emit)
  }

  scrape(emit: ConsumerEvent['emit']) {
    this.info('Scraping started...')
    const sources = [
      ...this.hosts.map((host: any) =>
        fetch(host.endpoints.health)
          .then((data) => data.json())
          .then((data) => this.prepareHealthData(data))
          .then((data) => emit('data', { type: 'health', host, data }))
          .catch((error) => Promise.reject({ type: 'health', error, host }))
      ),
      ...this.hosts.map((host: any) =>
        fetch(host.endpoints.rundown)
          .then((data) => data.json())
          .then((data) => emit('data', { type: 'rundown', host, data }))
          .catch((error) => Promise.reject({ type: 'rundown', error, host }))
      ),
    ]
    Promise.allSettled(sources)
      .then((results) =>
        results.forEach((result) => {
          if (result.status === 'rejected')
            this.error(
              `Failed scraping from ${result.reason.host.name}(${result.reason.type}) with:\n  ${result.reason.error}`
            )
        })
      )
      .catch(this.info)
      .finally(() => this.info('Scraping done.'))
  }

  prepareHealthData(health: any) {
    const notConnectedThreshold = moment()
      .subtract(process.env.NOT_CONNECTED_THRESHOLD || 20, 'minutes')
      .toDate()
      .getTime()

    for (let componentKey in health.components) {
      if (notConnectedThreshold > moment(health.components[componentKey].updated).toDate().getTime()) {
        health.components[componentKey].status = 'NOT CONNECTED'
        health.status = health.status !== 'FAIL' ? 'WARNING' : health.status
      }
    }

    return health
  }
}
