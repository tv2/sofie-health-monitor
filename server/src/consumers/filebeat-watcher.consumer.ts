import { EventConsumer, ConsumerEvent } from '../lib/events'

export class FilebeatWatcherConsumer extends EventConsumer {

  consume({ event, data, emit }: ConsumerEvent) {
    switch (data.type) {
      case 'health': return this._filebeat(data)
      default: return
    }
  }

  _filebeat({ host, data: health }: ConsumerEvent['data']) {
    const status = health.status

    switch (status) {
      case 'OK': return

      case 'WARNING': return this.warn({
        status,
        host: host.name,
        message: health._internal.messages,
      })

      case 'FAIL': return this.error({
        status,
        host: host.name,
        message: health._internal.messages,
      })

      default: return this.error({
        status,
        host: host.name,
        unknownStatus: true,
        message: health._internal.messages,
      })
    }
  }
}
