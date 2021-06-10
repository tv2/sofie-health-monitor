import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { toggleDocumentation } from '../actions/documentation.actions'
import { setSortOptions, setFilterQuery } from '../actions/query.actions'

import DocumentationIcon from '../../assets/images/help-circle.svg'
import './header.component.scss'

import { parse } from '../utilities/query'

function Header() {
  const dispatch = useDispatch()

  const [query, setQuery] = useState('') as any
  const [badQuery, setBadQuery] = useState(false) as any

  // Process query
  useEffect(() => {
    try {
      const { filter: filterQuery, sort: sortOptions } = parse(query)
      dispatch(setFilterQuery(filterQuery))
      dispatch(setSortOptions(sortOptions))
      setBadQuery(false)
    } catch (e) {
      setBadQuery(true)
    }
  }, [query])

  return (
    <header className={`c-header ${ badQuery && 'bad-query' }`}>
      <input spellCheck={false} value={query} placeholder="Type here to filter" onInput={(event: any): any => { setQuery(event.target.value) }} />
      <div className="c-header__documentation">
        <a onClick={ () => dispatch(toggleDocumentation()) }>
          <img src={ DocumentationIcon } alt="Toggle documentation"/>
        </a>
      </div>
    </header>
  )
}

export default Header
