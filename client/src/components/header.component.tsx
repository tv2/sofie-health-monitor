import React, { useState, useEffect } from 'react'

import './header.component.scss'
import HelpIcon from '../../assets/images/help-circle.svg'

function Header(props: any) {
  return (
    <header className={`c-header ${!props.queryHealth ? 'bad-query' : ''}`}>
      <input spellCheck={false} value={props.query} onInput={(e) => props.onQuery(e.target.value)} placeholder="Type here to filter and sort" />
      <div className="c-header__docs">
        <a onClick={ props.onShowDocs }>
          <img src={HelpIcon} alt="Docs" />
        </a>
      </div>
    </header>
  )
}

export default Header
