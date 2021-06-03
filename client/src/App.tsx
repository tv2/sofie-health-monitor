import React, { useState, useEffect } from 'react'
import SocketClient from 'socket.io-client'
import logo from './logo.svg'

import HostTable from './components/host-table.component'
import PropertyArea from './components/property-area.component'
//import Header from './components/header.component'

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
  const [propertyHost, setPropertyHost] = useState(null) as [any, any]

  useEffect(() => {
    const socket = SocketClient(ENDPOINT)
    socket.on('hosts-changed', (hosts) => { console.log(hosts); setHosts(hosts)})
    socket.on('host-changed', ({ host, state }) => { console.log({host, state}); setHosts((oldHosts: any) => ({ ...oldHosts, [host]: state }))})
  }, [])


  const hostOnClick = ({ key, host }: any) => setPropertyHost({ name: key, info: host })

  return (
    <div className="App">
      <header>Header</header>
      <main>
        <ReflexContainer orientation="vertical">
          <ReflexElement className="left-pane">
            <HostTable hosts={hosts} onclick={hostOnClick} />
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
