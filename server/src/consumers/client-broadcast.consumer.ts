import { EventConsumer, ConsumerEvent } from '../lib/events'
import { Server, Socket } from 'socket.io'

export class ClientBroadcastConsumer extends EventConsumer {
  socketServer: Server | null
  clients: { [key: string]: { initialized: boolean; socket: Socket } }

  constructor() {
    super()
    this.socketServer = null
    this.clients = {}
  }

  consume({ event, data, emit }: ConsumerEvent) {
    switch (event) {
      case 'web-server-started':
        return this._webServerStarted({ event, data, emit })
      case 'state-cache':
        return this._stateCache(data)
      case 'state-created':
      case 'state-changed':
        return this._stateChanged(data)
      default:
        this.warn(`Uncaught event: ${event}`)
    }
  }

  _stateCache(states: any) {
    Object.keys(this.clients)
      .filter((clientKey) => !this.clients[clientKey].initialized)
      .forEach((clientKey) => {
        Object.entries(states).forEach(([host, state]: [string, any]) => {
          this.clients[clientKey].socket.emit('host-changed', { host, state })
        })
        this.clients[clientKey].initialized = true
      })
  }

  _webServerStarted({ data: httpServer, emit }: ConsumerEvent) {
    if (this.socketServer) {
      this.info('Socket server already running.')
      return
    }

    this.socketServer = new Server(httpServer, {
      cors: {
        origin: '*',
      },
    })

    this.socketServer.on('connection', (socket: Socket) => {
      // TODO: Make options handshake first
      this.clients[socket.id] = { initialized: false, socket }
      this.info(`New connection with id: ${socket.id}`)
      emit('state-cache-request')

      socket.on('dicsonnect', () => {
        delete this.clients[socket.id]
      })
    })
  }

  _stateChanged(data: any) {
    if (!this.socketServer) {
      this.error(`ERROR: Can't broadcast without socket server.`)
      return
    }

    Object.values(this.clients).forEach((client) => {
      client.socket.emit('host-changed', data)
    })

    this.info(`Received ${data.type} data for ${data.host}`)
  }
}
