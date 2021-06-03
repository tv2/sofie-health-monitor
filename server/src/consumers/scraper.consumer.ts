import { EventConsumer, ConsumerEvent } from '../lib/events'
import { HostDefinition } from '../hosts'
import fetch from 'node-fetch'

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
      this.log('initial setup with hosts:\n ', this.hosts.map((host:any) => host.name).join('\n  '))
    }
    this.scrape(emit)
  }

  scrape(emit: ConsumerEvent['emit']) {
    this.log('Scraping started...')
    const sources = [
      ...this.hosts.map((host: any) => fetch(host.endpoints.health)
        .then(data => data.json())
        .then(data => emit('data', { type: 'health', host, data }))
        .catch(error => Promise.reject({ type: 'health', error, host }))
      ),
      ...this.hosts.map((host: any) => fetch(host.endpoints.rundown)
        .then(data => data.json())
        .then(data => emit('data', { type: 'rundown', host, data }))
        .catch(error => Promise.reject({ type: 'rundown', error, host }))
      )
      ]
    Promise.allSettled(sources)
      .then(results => results.forEach(result => {
        if (result.status === 'rejected') this.error(`Failed scraping from ${result.reason.host.name}(${result.reason.type}) with:\n  ${result.reason.error}`)
      }))
      .catch(this.log).finally(() => this.log('Scraping done.'))
  }
}
