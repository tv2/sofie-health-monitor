import moment from 'moment'
import { logger } from '../logger'

export interface ConsumerEvent {
  event: string,
  data: any,
  emit(event: string, data?: any): void,
}

export abstract class EventConsumer {
  abstract consume(event: ConsumerEvent): void

  log(data: any): void {
    logger.log(data)
  }

  info(...data: any[]): void {
    const dataObject = this._getDataObject(data)
    logger.log({ delegate: this.constructor.name, message: '', level: 'info', ...dataObject })
  }

  debug(...data: any[]): void {
    const dataObject = this._getDataObject(data)
    logger.log({ delegate: this.constructor.name, message: '', level: 'debug', ...dataObject })
  }

  warn(...data: any[]): void {
    const dataObject = this._getDataObject(data)
    logger.log({ delegate: this.constructor.name, message: '', level: 'warn', ...dataObject })
  }

  error(...data: any[]): void {
    const dataObject = this._getDataObject(data)
    logger.log({ delegate: this.constructor.name, message: '', level: 'error', ...dataObject })
  }

  protected _getDataObject(data: any[]) {
    if (data.length === 1 && typeof data[0] === 'object' && data[0] !== null) {
      return { ...data[0], _message: JSON.stringify(data[0]) }
    } else {
      return { _message: data.map(x => x.toString()).join(' ') }
    }
  }
}
