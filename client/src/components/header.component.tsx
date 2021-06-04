import React, { useState, useEffect } from 'react'

import './header.component.scss'

function Header() {
  return (
    <header className="c-header">
      <input spellCheck={false} placeholder="Type here to filter and sort" />
    </header>
  )
}

export default Header
