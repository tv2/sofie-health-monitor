import React, { useState, useEffect } from 'react'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import { removePropertyHost, setCurrentPropertyPanel } from '../actions/hosts.actions'

import Status from './status.component'

import moment from 'moment'
import { ReflexContainer, ReflexSplitter, ReflexElement } from 'react-reflex'

import './host-property-view.component.scss'

import RawLogo from '../../assets/images/code.svg'
import CloseLogo from '../../assets/images/x-circle.svg'
import CurrentLogo from '../../assets/images/eye.svg'
import ExternalLinkLogo from '../../assets/images/external-link.svg'

function HostPropertyView({ panel, target }: any) {
  const dispatch = useDispatch()
  const host = useSelector<any, any>((state) => ({ name: target, state: state.hosts.raw[target] }), shallowEqual)
  const currentPanel = useSelector<any, any>((state) => state.hosts.currentPanel)
  const [showRaw, setShowRaw] = useState(false) as [boolean, any]
  const [rawContent, setRawContent] = useState('') as [string, any]

  /**
   * Adds line numbers to raw content
   */
  useEffect(() => {
    const contentLines = JSON.stringify(host, null, 2).split('\n')
    const maxNumberLength = contentLines.length.toString().length
    setRawContent(
      contentLines
        .map((line, index) => {
          const lineNumber = index + 1
          const extraSpaceLength = maxNumberLength - lineNumber.toString().length
          return `${lineNumber}${extraSpaceLength > 0 ? ' '.repeat(extraSpaceLength) : ''}| ${line}`
        })
        .join('\n')
    )
  }, [host])

  return (
    <div className="c-host-property-view">
      <div className="c-host-property-view__wrapper">
        <ReflexContainer orientation="horizontal">
          <ReflexElement className="c-host-property-view__properties">
            <div className="c-host-property-view__toolbox">
              <div className={`setCurrent ${currentPanel === panel ? 'active' : ''}`}>
                <a onClick={() => dispatch(setCurrentPropertyPanel(panel))}>
                  <img
                    src={CurrentLogo}
                    alt={currentPanel === panel ? 'Is active panel' : 'Mark as active panel'}
                    title={currentPanel === panel ? 'Is active panel' : 'Mark as active panel'}
                  />
                </a>
              </div>
              <div className="extLink">
                <a href={`http://${target}.tv2.local`} target="_blank">
                  <img src={ExternalLinkLogo} alt="Go to Sofie instance" title="Go to Sofie instance" />
                </a>
              </div>
              <div className={`toggleRaw ${showRaw ? 'active' : ''}`}>
                <a onClick={() => setShowRaw((oldRaw: boolean) => !oldRaw)}>
                  <img
                    src={RawLogo}
                    alt={`${showRaw ? 'Hide' : 'Show'} raw JSON`}
                    title={`${showRaw ? 'Hide' : 'Show'} raw JSON`}
                  />
                </a>
              </div>
              <div className="closePanel">
                <a onClick={() => dispatch(removePropertyHost({ panel }))}>
                  <img src={CloseLogo} alt="Close panel" title="Close panel" />
                </a>
              </div>
            </div>

            <header>
              <h2>{target}</h2>
              <div>
                <Status type="health" status={host.state.health.status} />
              </div>
            </header>

            {host.state.health._internal.messages.length > 0 && (
              <section>
                <h3>Host messages</h3>
                <pre>{host.state.health._internal.messages.join('\n')}</pre>
              </section>
            )}
            {host.state.rundown && host.state.rundown.actives.length > 0 && (
              <section>
                <h3>Active rundowns</h3>
                <table>
                  <tbody>
                    {host.state.rundown.actives.map((rundown: any) => (
                      <tr key={rundown.name}>
                        <td key={`${rundown.name}-name`}>{rundown.name}</td>
                        <td key={`${rundown.name}-time`}>
                          {moment(rundown.startedPlayback).format('DD-MM-YYYY HH:mm:ss:SSS')}
                        </td>
                        <td key={`${rundown.name}-status`}>
                          <Status
                            type="rundown"
                            status={rundown.active ? (rundown.rehearsal ? 'REHEARSAL' : 'ACTIVE') : 'INACTIVE'}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            )}

            <section>
              <h3>Components</h3>
              <table>
                <tbody>
                  {host.state.health.components
                    .map((component: any) => {
                      const version = (component._internal.versions && component._internal.versions._process) || 'x.x.x'
                      return [
                        <tr key={component.instanceId}>
                          <td key={`${component.instanceId}-name`}>{component.name}</td>
                          <td key={`${component.instanceId}-updated`}>
                            {moment(component.updated).format('DD-MM-YYYY HH:mm:ss')}
                          </td>
                          <td key={`${component.instanceId}-version`}>{version}</td>
                          <td key={`${component.instanceId}-status`}>
                            <Status type="health" status={component.status} />
                          </td>
                        </tr>,
                        component.statusMessage && (
                          <tr key={`${component.instanceId}-error`} className="error">
                            <td key={`${component.instanceId}-error-messaage`} colSpan={4}>
                              {component.statusMessage}
                            </td>
                          </tr>
                        ),
                      ].filter((component) => component)
                    })
                    .flat()}
                </tbody>
              </table>
            </section>
          </ReflexElement>
          {showRaw && <ReflexSplitter />}
          {showRaw && (
            <ReflexElement className="c-host-property-view__raw">
              <pre>{rawContent}</pre>
            </ReflexElement>
          )}
        </ReflexContainer>
      </div>
    </div>
  )
}

export default HostPropertyView
