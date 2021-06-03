import moment from 'moment'

export interface ConsumerEvent {
  event: string,
  data: any,
  emit(event: string, data?: any): void,
}

export abstract class EventConsumer {
  abstract consume(event: ConsumerEvent): void

  log(...data: any[]): void {
    setImmediate(() => console.log(`${moment().format('DD/MM/YYYY HH:mm:ss:SSS')} [${this.constructor.name}]`, ...data))
  }

  error(...data: any[]): void {
    setImmediate(() => console.error(`\x1b[31m${moment().format('DD/MM/YYYY HH:mm:ss:SSS')} [${this.constructor.name}] ${data.map(x => x.toString()).join(' ')}\x1b[0m`))

  }
}
