import React from 'react'
import ReactDOM from 'react-dom'
import 'typeface-pt-sans'
import { registerObserver } from 'react-perf-devtool'

import App from './App'
import registerServiceWorker from './registerServiceWorker'

if (process.env.NODE_ENV === 'development') {
  window.observer = registerObserver()
}

ReactDOM.render(<App />, document.getElementById('root'))

registerServiceWorker()
