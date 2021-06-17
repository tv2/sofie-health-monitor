import moment from 'moment'
import { logger } from '../logger'

export interface ConsumerEvent {
  event: string,
  data: any,
  emit(event: string, data?: any): void,
}

export abstract class EventConsumer {
  abstract consume(event: ConsumerEvent): void

  log(...data: any[]): void {
    this.info(...data)
  }

  info(...data: any[]): void {
    logger.log({ deligate: this.constructor.name, message: data.map(x => x.toString()).join(' '), level: 'info' })
  }

  debug(...data: any[]): void {
    logger.log({ deligate: this.constructor.name, message: data.map(x => x.toString()).join(' '), level: 'debug' })
  }

  warn(...data: any[]): void {
    logger.log({ deligate: this.constructor.name, message: data.map(x => x.toString()).join(' '), level: 'warn' })
  }

  error(...data: any[]): void {
    logger.log({ deligate: this.constructor.name, message: data.map(x => x.toString()).join(' '), level: 'error' })
  }
}
