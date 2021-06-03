import { EventConsumer, ConsumerEvent } from '../lib/events'
import { Server, Socket } from 'socket.io'

export class ClientBroadcastConsumer extends EventConsumer {

  socketServer: Server | null
  clients: { [key:string]: { initialized: boolean, socket: Socket } }

  constructor() {
    super()
    this.socketServer = null
    this.clients = {}
  }

  consume({ event, data, emit }: ConsumerEvent) {
    switch (event) {
      case 'web-server-started': return this._webServerStarted({ event, data, emit })
      case 'state-cache': return this._stateCache(data)
      case 'state-created':
      case 'state-changed': return this._stateChanged(data)
      default: this.log(`Uncaught event: ${event}`)
    }
  }

  _stateCache(state: any) {
    Object.keys(this.clients)
      .filter(clientKey => !this.clients[clientKey].initialized)
      .forEach(clientKey => {
        this.clients[clientKey].socket.emit('hosts-changed', state)
        this.clients[clientKey].initialized = true
      })
  }

  _webServerStarted({ data: httpServer, emit }: ConsumerEvent) {
    if (this.socketServer) {
      this.log('Socket server already running.')
      return
    }

    this.socketServer = new Server(httpServer, {
      cors: {
        origin: '*'
      },
    })

    this.socketServer.on('connection', (socket: Socket) => {
      // TODO: Make options handshake first
      this.clients[socket.id] = { initialized: false, socket }
      this.log(`New connection with id: ${socket.id}`)
      emit('state-cache-request')

      socket.on('dicsonnect', () => { delete this.clients[socket.id] })
    })

  }

  _stateChanged(data: any) {
    if (!this.socketServer) {
      this.log(`ERROR: Can't broadcast without socket server.`)
      return
    }
    Object.values(this.clients).forEach(client => {
      client.socket.emit('host-changed', data)
    })
    this.log(`Received data for ${data.host}`)
  }
}
