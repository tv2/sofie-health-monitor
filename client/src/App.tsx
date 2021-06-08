import React, { useState, useEffect } from 'react'
import SocketClient from 'socket.io-client'
import logo from './logo.svg'

import HostTable from './components/host-table.component'
import PropertyArea from './components/property-area.component'
import Header from './components/header.component'
import Docs from './components/docs.component'

import * as Query from './lib/query'

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
  const [query, setQuery] = useState('') as [any, any]
  const [queryHealth, setQueryHealth] = useState(true) as [any, any]
  const [queryHosts, setQueryHosts] = useState({}) as [any, any]
  const [splitOrientation, setSplitOrientation] = useState('vertical') as [any, any]
  const [showDocs, setShowDocs] = useState(false) as [any, any]

  useEffect(() => {
      if (query.trim() === '') {
        setQueryHosts(hosts)
        setQueryHealth(true)
        return
      }

      let queryBuild: any = null
      try {
        queryBuild = Query.parse(query)
        const selectedHosts = Object.entries(hosts)
          .map(([key, host]: any) => ({ key, host, value: Query.interpret(queryBuild, host) }))
          .filter(({ value }: any) => value)
          .reduce((acc: any, { key, host }: any) => ({ ...acc, [key]: host }), {})

        setQueryHosts(selectedHosts)
        setQueryHealth(true)
      } catch (e) {
        setQueryHosts({})
        setQueryHealth(false)
      }

  }, [query, hosts])

  useEffect(() => {
    const socket = SocketClient(ENDPOINT)
    socket.on('host-changed', ({ host, state }) => {
      setHosts((oldHosts: any) => ({ ...oldHosts, [host]: { name: host, ...state } }))
      // Update current host info (updates in property area)
      if (currentHost === host) {
        setCurrentHost(() => ({ name: host, info: state }))
      }
    })
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

    return () => window.removeEventListener('resize', handleResize)
  })

  const hostOnClick = ({ key, host }: any) => {
    setCurrentHost(() => ({ name: key, info: host }))
  }

  return (
    <div className="App">
      <Header query={query} queryHealth={queryHealth} onQuery={setQuery} onShowDocs={() => setShowDocs((old:boolean) => !old)} />
      <main>
        <ReflexContainer orientation={splitOrientation}>
          <ReflexElement className="left-pane">
            <HostTable hosts={queryHosts} current={currentHost} onclick={hostOnClick} />
          </ReflexElement>
          <ReflexSplitter/>
          <ReflexElement className="right-pane">
            <PropertyArea host={currentHost} />
          </ReflexElement>
          { showDocs &&
            <ReflexSplitter style={{ display: showDocs ? 'block' : 'none' }} />
          }
          { showDocs &&
            <ReflexElement>
              <Docs show={true} close={() => setShowDocs(false)} />
            </ReflexElement>
          }
        </ReflexContainer>
      </main>
    </div>
  )
}

export default App
