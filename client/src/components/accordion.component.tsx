import React, { useState } from 'react'
import './accordion.component.scss'

function Accordion(props: any) {
  const [open, setOpen] = useState(false)

  const toggle = () => {
    setOpen(!open)
  }

  return (
    <div className={`c-accordion ${open ? 'open' : ''}`}>
      <div className="c-accordion__header" onClick={toggle}>
        { props.title }
      </div>
      <div className="c-accordion__content">
        { props.children }
      </div>
    </div>
  )
}

export default Accordion
