import React, { useState, useEffect } from 'react'
import './host-table.component.scss'

const defaultSortOption = ({ key: key1, host: host1 }: any, { key: key2, host: host2 }: any) => {
  const keyStr1 = key1.replace(/[0-9]/g, '')
  const keyStr2 = key2.replace(/[0-9]/g, '')
  const keyDig1 = parseInt(key1.replace(/[^0-9]/g, '') || '0', 10)
  const keyDig2 = parseInt(key2.replace(/[^0-9]/g, '') || '0', 10)
  if (keyStr1 == keyStr2) return keyDig1 > keyDig2
  else return keyStr1 > keyStr2
}

function HostTable(props: any) {

  const sortOption = props.sortOption || defaultSortOption

  return (
    <div className="c-host-table">
      <table>
        <tbody>
          { Object.entries(props.hosts)
              .map(([key,host]: [string, any])=> ({ key, host }))
              .sort(sortOption).map(({ key, host }) => { return (
                <tr key={key} onClick={() => props.onclick({ key, host })}>
                  <td key={`${key}-name`}>{ key }</td>
                  <td key={`${key}-rundown`}>{ host.rundown === null ? 'Loading...' : (host.rundown.actives.length > 0 ? 'ACTIVE' : 'INACTIVE') }</td>
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
