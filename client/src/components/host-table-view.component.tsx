import React from 'react'
import moment from 'moment'

import Status from './status.component'

import './host-table-view.component.scss'

function HostTableView ({ selectedHosts, hosts, onClick }: any) {
  return (
    <div className="c-host-table-view">
      <table>
        <thead>
          <tr>
            <th key="name">Name</th>
            <th key="updated">Last seen</th>
            <th key="rundown">Rundown</th>
            <th key="health">Health</th>
          </tr>
        </thead>
        <tbody>
        {(() => {
          if (hosts && hosts.length) {
            return hosts.map((host: any) => {
              const rundown = host.state.rundown && host.state.rundown.actives && host.state.rundown.actives.length > 0 ? host.state.rundown.actives[0] : {}
              const rundownStatus = host.rundown === null ? 'Loading...' : (rundown.active ? (rundown.rehearsal ? 'REHEARSAL' : 'ACTIVE') : 'INACTIVE' ) 
              const healthStatus = host.health === null ? 'Loading...' : host.state.health.status
              return (
                <tr key={host.name} className={ selectedHosts.map(({ host: name }: any) => name).includes(host.name) ? 'current' : ''} onClick={ event => onClick(event, host) }>
                  <td key={`${host.name}-name.`}>{ host.name }</td>
                  <td key={`${host.name}-updated.`}>{ moment(host.state.health.updated).format('DD-MM-YYYY HH:mm:ss') }</td>
                  <td key={`${host.name}-rundown`}>
                    <Status type="rundown" status={ rundownStatus } />
                  </td>
                  <td key={`${host.name}-status`}>
                    <Status type='health' status={ healthStatus } />
                  </td>
                </tr>
              )
            })
          } else {
            return null
          }
        })()}
        </tbody>
      </table>
    </div>
  )
}

export default HostTableView
