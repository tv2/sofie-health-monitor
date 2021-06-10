import React from 'react'
import { useDispatch } from 'react-redux'

import './documentation-view.component.scss'

import CloseLogo from '../../assets/images/x-circle.svg'

function DocumentationView({ show, onClose }: any) {
  const dispatch = useDispatch()
  return (
    <div className={`c-documentation-view ${show ? 'show' : ''}`}>
      <div className="c-documentation-view__header">
        <h2>Documentation</h2>
        <a className="c-documentation-view__close" onClick={onClose}><img src={CloseLogo} /></a>
      </div>

      <div className="c-documentation-view__content">
        <h3>Queries</h3>
        <pre>
          {
          '[Options]\n' +
          'n[ame]: A sequence of characters without space and special characters.\n' +
          'r[undown]: active | inactive | rehearsal\n' +
          's[tatus]: ok | fail | warning\n' +
          'is: qbox\n' +
          '\n' +
          '[Operators]\n' +
          '!option: Not option\n' +
          'o1 and o2: Both options must be satisfied.\n' +
          'o1 or o2: At least one option must be satisfied.\n' +
          '\n' +
          '[Misc]\n' +
          ' - Parantheses can be used to nest options and operators.\n' +
          ' - If no option key is defined, name is assumed.'
          }
        </pre>
      </div>
    </div>
  )
}

export default DocumentationView

