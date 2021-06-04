import React, { useState, useEffect } from 'react'
import moment from 'moment'

import './host-table.component.scss'
import './status.scss'

const defaultSortOption = ({ key: key1, host: host1 }: any, { key: key2, host: host2 }: any) => {
  const keyStr1 = key1.replace(/[0-9]/g, '')
  const keyStr2 = key2.replace(/[0-9]/g, '')
  const keyDig1 = parseInt(key1.replace(/[^0-9]/g, '') || '0', 10)
  const keyDig2 = parseInt(key2.replace(/[^0-9]/g, '') || '0', 10)
  if (keyStr1 == keyStr2)
    return keyDig1 > keyDig2 ? 1 : -1
  else return keyStr1 > keyStr2 ? 1 : -1
}

function HostTable(props: any) {

  const sortOption = props.sortOption || defaultSortOption

  return (
    <div className="c-host-table">
      <table>
        <tbody>
          { Object.keys(props.hosts).length === 0 ? (<tr key="no-hosts" className="not-content"><td colSpan={4}>No hosts matched the given query.</td></tr>) : Object.entries(props.hosts)
              .map(([key,host]: [string, any])=> ({ key, host }))
              .sort(sortOption).map(({ key, host }) => {
                  const rundown = host.rundown && host.rundown.actives && host.rundown.actives.length > 0 ? host.rundown.actives[0] : {}
                  return (
                  <tr key={key} className={props.current === key ? 'current' : ''} onClick={() => props.onclick({ key, host })}>
                    <td key={`${key}-name`}>{ key }</td>
                    <td key={`${key}-updated`}>{ moment(host.health.updated).format('DD-MM-YYYY HH:mm') }</td>
                    <td key={`${key}-rundown`}>
                      <div className={`c-rundown-status ${rundown.active ? (rundown.rehearsal ? 'rehearsal' : 'active') : 'inactive'}`}>
                        { host.rundown === null ? 'Loading...' : (rundown.active ? (rundown.rehearsal ? 'REHEARSAL' : 'ACTIVE') : 'INACTIVE' ) }
                      </div>
                    </td>
                    <td key={`${key}-status`}><div className={`c-host-status ${ host.health.status.toLowerCase() }`}>{ host.health === null ? 'Loading...' : host.health.status }</div></td>
                  </tr>
              )})
          }
        </tbody>
      </table>
    </div>
  )
}

export default HostTable
