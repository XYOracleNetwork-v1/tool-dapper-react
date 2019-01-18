import React from 'react'
import ReactDOM from 'react-dom'
import 'typeface-pt-sans'

import App from './App'
import registerServiceWorker from './registerServiceWorker'

ReactDOM.render(<App/>, document.getElementById('root'))

registerServiceWorker()
