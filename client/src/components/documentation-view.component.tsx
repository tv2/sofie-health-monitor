import React from 'react'
import { useDispatch } from 'react-redux'

import './documentation-view.component.scss'

import CloseLogo from '../../assets/images/x-circle.svg'

import documentationText from '../documentation.json'

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
          { documentationText.join('\n') }
        </pre>
      </div>
    </div>
  )
}

export default DocumentationView

