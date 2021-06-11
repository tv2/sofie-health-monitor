import React, { useState, useEffect, useRef } from 'react'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'

import HostTableView from './host-table-view.component'
import HostPropertyView from './host-property-view.component'
import DocumentationView from './documentation-view.component'

import { interpret, sort } from '../utilities/query'

import { setDisplayHosts, setPropertyHost, setCurrentPropertyPanel } from '../actions/hosts.actions'
import { toggleDocumentation } from '../actions/documentation.actions'

import {
  ReflexContainer,
  ReflexSplitter,
  ReflexElement
} from 'react-reflex'

import './main.component.scss'

function Main() {
  const dispatch = useDispatch()
  const query = useSelector<any,any>(state => state.query, shallowEqual)
  const hosts = useSelector<any,any>(state => state.hosts, shallowEqual)

  /**
   * Filter and sort on new queries and new data
   */
  useEffect(() => {
    try {
      const filterFun = interpret(query.filter)
      const sortFun = sort(query.sort)
      const displayHosts = Object.entries(hosts.raw)
        .map(([name, state]: any) => ({ name, state }))
        .filter(filterFun).sort(sortFun).map(({ name }) => name)
      dispatch(setDisplayHosts(displayHosts))
    } catch (e) {
      console.error(e)
    }
  }, [query, hosts.raw])

  /**
   * Handles split pane orientation on resize
   */
  const [splitOrientation, setSplitOrientation] = useState('vertical') as any
  const splitOrientationRef = useRef(splitOrientation)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1100 && splitOrientationRef.current === 'vertical') {
        setSplitOrientation('horizontal')
        splitOrientationRef.current = 'horizontal'
      } else if (window >= 1100 && splitOrientationRef.current === 'horizontal') {
        setSplitOrientation('vertical')
        splitOrientationRef.current = 'vertical'
      }
    }
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  })

  /**
   * HostTableView handler for choosing a host
   */
  const currentPanel = useSelector<any,any>(state => state.hosts.currentPanel)
  const handleHostTableViewClick = (event: any, host: any) => {
    const panel = event.metaKey || event.ctrlKey ? Date.now().toString() : currentPanel
    dispatch(setPropertyHost({ panel, host: host.name }))

    // Check if currentPanel is set
    const noCurrent = hosts.property.filter(({ panel }: any) => panel === currentPanel).length === 0
    if (noCurrent) {
      dispatch(setCurrentPropertyPanel(panel))
    }
  }

  /**
   * Documentation toggling
   */
  const showDocumentation = useSelector<any,any>(state => state.documentation.show)

  return (
    <main className='c-main'>
      <ReflexContainer orientation={splitOrientation}>
        { [
        <ReflexElement key="host-view" className="left-pane">
          <HostTableView selectedHosts={hosts.property} hosts={hosts.display.map((name: string) => ({ name, state: hosts.raw[name] }))} onClick={handleHostTableViewClick} />
        </ReflexElement>,
        hosts.property.length && <ReflexSplitter key="host-view-splitter" />,
        hosts.property.length && (
          <ReflexElement key="property-view">
            <ReflexContainer orientation={splitOrientation}>
              { hosts.property.map(({ panel, host: name }: any) => {
                  return [
                    <ReflexElement key={panel} className={`${panel}-panel`}>
                      <HostPropertyView panel={panel} target={name} />
                    </ReflexElement>,
                    <ReflexSplitter propagate={true} key={`${panel}-splitter`}/>
                  ]
              }).flat().slice(0,-1) }
            </ReflexContainer>
          </ReflexElement>
        ),
        showDocumentation && <ReflexSplitter key="documentation-view-splitter" />,
        showDocumentation && <ReflexElement key="documentation-view">
          <DocumentationView onClose={() => dispatch(toggleDocumentation())} />
        </ReflexElement>
        ].filter(component => component) }
      </ReflexContainer>
    </main>
  )
}

export default Main
