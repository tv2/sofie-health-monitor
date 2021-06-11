import SocketClient, { Socket } from 'socket.io-client'

import { setHost } from '../actions/hosts.actions'

let socket: Socket

export function register(event: string, handle: any) {
  if (socket) socket
}

export const setup = (dispatch: any) => (endpoint: string) => {
  socket = SocketClient(endpoint)

  socket.on('host-changed', ({ host: name, state }) => dispatch(setHost({ name, state })))

  return socket
}
