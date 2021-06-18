import { EventConsumer, ConsumerEvent } from '../lib/events'
import express from 'express'
import { Server } from 'http'

export class WebServerConsumer extends EventConsumer {

  server?: Server
  port: number

  constructor({ port }: { port?: number } = {}) {
    super()
    this.port = port || parseInt(process.env.PORT || '8080', 10)
  }

  consume({ emit }: ConsumerEvent) {
    if (!this.server) {
      const app = express()
      app.use('/', express.static('../client/dist'))
      this.server = new Server(app)
      this.server.listen(this.port, () => {
        this.info(`Webserver started at http://localhost:${this.port}`)
        emit('web-server-started', this.server)
      })
    }
  }
}
