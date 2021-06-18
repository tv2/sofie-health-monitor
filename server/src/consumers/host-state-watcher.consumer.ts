import { EventConsumer, ConsumerEvent } from '../lib/events'
import { diff } from 'deep-diff'

export interface HostState {
  [key: string]: any
}

export class HostStateWatcherConsumer extends EventConsumer {

  hostStates: { [key: string]: HostState }

  constructor() {
    super()
    this.hostStates = {}
  }

  consume({ event, data, emit } : ConsumerEvent) {
    switch (event) {
      case 'data': return this._data({ event, data, emit })
      case 'state-cache-request': return this._cacheRequest({ event, data, emit })
    }
  }

  _cacheRequest({ data, emit }: ConsumerEvent) {
    this.info('State cache emitted.')
    emit('state-cache', this.hostStates)
  }

  _data({ data, emit }: ConsumerEvent) {
    switch (data.type) {
      case 'health':  return this._dataHealth(data, emit)
      case 'rundown': return this._dataRundown(data, emit)
    }
  }

  _dataHealth({ host, data: state, type }: any, emit: any) {
    const createdState = this._ensureState({ type: 'health', host, state })

    if (createdState) {
      this.info(`Initial state for ${host.name} (health) has been stored.`)
      emit('state-created', { host: host.name, type, state: this.hostStates[host.name] })

    } else {
      const stateDiff = (diff(this.hostStates[host.name].health, state) || [])
        //.filter(d => !(d.kind === 'E' && (d.path || []).includes('updated')))
      const hasChanges = stateDiff.length > 0

      if (hasChanges) {
        this.hostStates[host.name].health = state
        this.info(`State for ${host.name} (health) has changed.`)
        emit('state-changed', { host: host.name, type, state: this.hostStates[host.name] })
      }
    }
  }

  _dataRundown({ host, data: state, type }: any, emit: any) {
    const createdState = this._ensureState({ type: 'rundown', host, state: { actives: state } })

    if (createdState) {
      this.info(`Initial state for ${host.name} (rundown) has been stored.`)
      emit('state-created', { host: host.name, type, state: this.hostStates[host.name] })

    } else {

      const stateDiff =  diff(this.hostStates[host.name].rundown.actives, state) || []
      const hasChanges = stateDiff.length > 0

      if (hasChanges) {
        this.hostStates[host.name].rundown.actives = state
        this.info(`State for ${host.name} (rundown) has changed.`, stateDiff)
        emit('state-changed', { host: host.name, type, state: this.hostStates[host.name] })
      }
    }
  }

  /**
   * Ensures that a state object is present for the requested host.
   * Returns true if is initial state, otherwise false.
   */
  _ensureState({ type, host, state }: any) {
    if (!(host.name in this.hostStates)) {
      this.hostStates[host.name] = { 
        health: null,
        rundown: null,
        [type]: state,
      }
      return true
    } else if (this.hostStates[host.name][type] === null) {
      this.hostStates[host.name][type] = state
      return true
    }
    return false
  }
}
