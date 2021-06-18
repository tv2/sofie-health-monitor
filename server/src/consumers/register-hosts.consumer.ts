import { EventConsumer, ConsumerEvent } from '../lib/events'
import hosts from '../hosts'

export class RegisterHostsConsumer extends EventConsumer {
  consume({ emit }: ConsumerEvent) {
    emit('hosts-registered', hosts)
    this.info('Hosts registered')
  }
}
