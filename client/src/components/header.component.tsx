import React, { useState, useEffect } from 'react'

import './header.component.scss'

function Header(props: any) {
  return (
    <header className={`c-header ${!props.queryHealth ? 'bad-query' : ''}`}>
      <input spellCheck={false} value={props.query} onInput={(e) => props.onQuery(e.target.value)} placeholder="Type here to filter and sort" />
    </header>
  )
}

export default Header
