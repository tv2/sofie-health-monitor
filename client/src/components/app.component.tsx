import React, { useEffect, useRef, useState } from 'react'

import { useSelector, useDispatch } from 'react-redux'

import Header from './header.component'
import Main from './main.component'

import * as HealthBroker from '../services/health-broker.service'
import config from '../config'

import './app.component.scss'

function App() {
  const dispatch = useDispatch()

  // Setup websocket connection
  useEffect(() => {
    const socket = HealthBroker.setup(dispatch)(config.endpoints.backend)
    return () => {
      socket.disconnect()
    }
    // TODO: add dispatch
  }, [])

  return (
    <div className="c-app">
      <Header />
      <Main />
    </div>
  )
}

export default App
