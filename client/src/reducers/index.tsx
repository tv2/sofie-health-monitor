import { combineReducers } from 'redux'

import hostReducer from './hosts.reducer'
import queryReducer from './query.reducer'
import documentationReducer from './documentation.reducer'

const rootReducer = combineReducers({
  hosts: hostReducer,
  query: queryReducer,
  documentation: documentationReducer,
})

export default rootReducer
