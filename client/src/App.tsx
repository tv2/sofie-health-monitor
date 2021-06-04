import React, { useState, useEffect } from 'react'
import SocketClient from 'socket.io-client'
import logo from './logo.svg'

import HostTable from './components/host-table.component'
import PropertyArea from './components/property-area.component'
import Header from './components/header.component'

import moment from 'moment'

import {
  ReflexContainer,
  ReflexSplitter,
  ReflexElement
} from 'react-reflex'

import 'react-reflex/styles.css'

import './App.scss'

const ENDPOINT = import.meta.env.DEV ? 'http://localhost:8080' : window.location.href

function App() {
  const [hosts, setHosts] = useState({}) as [any, any]
  const [currentHost, setCurrentHost] = useState(null) as [any, any]
  const [propertyHost, setPropertyHost] = useState(null) as [any, any]
  const [splitOrientation, setSplitOrientation] = useState('vertical') as [any, any]

  useEffect(() => {
    const socket = SocketClient(ENDPOINT)
    socket.on('host-changed', ({ host, state }) => { setHosts((oldHosts: any) => ({ ...oldHosts, [host]: state }))})
    return () => { socket.disconnect() }
  }, [])

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 1100) {
        setSplitOrientation('horizontal')
      } else {
        setSplitOrientation('vertical')

      }
    }

    handleResize()

    window.addEventListener('resize', handleResize)

    return () => window.addEventListener('resize', handleResize)
  })

  const hostOnClick = ({ key, host }: any) => {
    setPropertyHost({ name: key, info: host })
    setCurrentHost(key)
  }

  return (
    <div className="App">
      <Header />
      <main>
        <ReflexContainer orientation={splitOrientation}>
          <ReflexElement className="left-pane">
            <HostTable hosts={hosts} current={currentHost} onclick={hostOnClick} />
          </ReflexElement>
          <ReflexSplitter/>
          <ReflexElement className="right-pane">
            <PropertyArea host={propertyHost} />
          </ReflexElement>
        </ReflexContainer>
      </main>
    </div>
  )
}

export default App
