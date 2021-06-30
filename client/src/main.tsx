import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import store from './store'

import App from './components/app.component'

import 'react-reflex/styles.css'
import './index.scss'

import { version as healthMonitorVersion } from '../../package.json'
console.log(`Health Monitor Version: ${healthMonitorVersion}`)

const rootElement = document.getElementById('root')

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  rootElement
)
