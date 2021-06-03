import React, { useState, useEffect } from 'react'
import './property-area.component.scss'
import moment from 'moment'

import Accordion from './accordion.component'

function PropertyArea(props: any) {
  return (
    <div className="c-property-area">
      { props.host === null
        ? emptyPropertyArea(props)
        : propertyArea(props)
        }
    </div>
  )
}

/**
 * Component for when no host is selected
 */
function emptyPropertyArea(props: any) {
  return (<p>Select a host to see its properties.</p>)
}

/**
 * Outermost component of the property area
 */
function propertyArea(props: any) {
   return (
     <div>
      <h1>{ props.host.name }</h1>
      { hostMessages(props) }
      { rundownProperties(props) }
      { componentProperties(props) }
      { rawPropertyData(props) }
     </div>
   )
}

/**
 * Component holding host warnings and errors
 */
function hostMessages(props: any) {
  if (props.host.info.health._internal.messages.length === 0) {
    return
  }

  return (
    <div>
      <h2>{ props.host.info.health.status }</h2>
      <pre>{ props.host.info.health._internal.messages.join('\n') }</pre>
    </div>
  )
}

/**
 * Component holding rundown info for active rundowns
 */
function rundownProperties(props: any) {
  if (!props.host.info.rundown || props.host.info.rundown.actives.length === 0) {
    return
  }
  return (
      <div>
        <h2>Active rundowns</h2>
        <table>
          <tbody>
            { props.host.info.rundown.actives.map(((rundown: any) => (
                <tr key={rundown.name}>
                  <td key={`${rundown.name}-name`}>{ rundown.name }</td>
                  <td key={`${rundown.name}-time`}>{ moment(rundown.startedPlayback).format('DD/MM/YYYY HH:mm:ss:SSS') }</td>
                  <td key={`${rundown.name}-status`}>{ rundown.rehearsal ? 'REHEARSAL' : 'ACTIVE' }</td>
                </tr>
                )
              ))
            }
          </tbody>
        </table>
      </div>
      )
}

/**
 * Component holding device component information
 */
function componentProperties(props: any) {
  if (!props.host.info.health) {
    return
  }

  const playoutGatewayComponent = props.host.info.health.components.filter((component: any) => component.name === 'Playout gateway')

  let playoutVersions = {}
  try {
    if (playoutGatewayComponent.length === 1) playoutVersions = playoutGatewayComponent[0]._internal._versions
  } finally {}

  const fallbackVersion = (name: string) => {
    // TODO: return versions (use regex) mark in paranthesis to indicate that this is not exact information
    if (name.match(/atem/ig))
    return 'unknown'
  }

  return (
      <div>
        <h2>Components</h2>
        <table>
          <tbody>
            { props.host.info.health.components.map((component: any) => {
                let version = 'unknown'
                try {
                  version = component._internal.versions._process || 'unknown'
                } finally {}
                return (
                  <tr key={component.instanceId}>
                    <td key={`${component.instanceId}-name`}>{ component.name }</td>
                    <td key={`${component.instanceId}-rundown`}>{ component.status !== 'OK' ? component.statusMessage : '' }</td>
                    <td key={`${component.instanceId}-version`}>{ version }</td>
                    <td key={`${component.instanceId}-status`}>{ component.status }</td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </div>
      )
}

/**
 * Component holding the raw JSON data
 */
function rawPropertyData(props: any) {
  const [content, setContent] = useState('')

  useEffect(() => {
    const contentLines = JSON.stringify(props.host, null, 2).split('\n')
    const maxLineNumberSize = contentLines.length.toString().length
    setContent(contentLines.map((line,index) => {
      const lineNumber = index + 1
      const numberExtraSpaces = maxLineNumberSize - lineNumber.toString().length
      return `${lineNumber}${numberExtraSpaces > 0 ? ' '.repeat(numberExtraSpaces) : ''}| ${line}`
    }).join('\n'))
  }, [props.host])

  return (
    <Accordion title="Raw data">
      <pre className="c-code-view">
        { content }
      </pre>
    </Accordion>
  )
}

export default PropertyArea

