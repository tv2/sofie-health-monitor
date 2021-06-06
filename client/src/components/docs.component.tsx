import React, { useState, useEffect } from 'react'

import './docs.component.scss'

import CloseLogo from '../../assets/images/x-circle.svg'

function Docs(props: any) {
  return (
    <div className={`c-docs ${props.show ? 'show' : ''}`}>
      <div className="c-docs__header">
        <h2>Documentation</h2>
        <a className="c-docs__close" onClick={props.close}><img src={CloseLogo} /></a>
      </div>

      <div className="c-docs__content">
        <h3>Queries</h3>
        <pre>
          {
          'n[ame]: A sequence of characters without space and special characters.\n' +
          'r[undown]: active | inactive | rehearsal\n' +
          's[tatus]: ok | fail | warning\n' +
          '!command: Negated command\n' +
          'is: qbox\n'
          }
        </pre>
      </div>
    </div>
  )
}

export default Docs
