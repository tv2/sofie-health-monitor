import React from 'react'

import './status.component.scss'

function Status({ children, status, type }: any) {
  return (
    <div className={`c-status ${type} ${status.toLowerCase()}`}>
      { children || status }
    </div>
  )
}

export default Status
