import React from 'react'
import HomeComponent from './components/pages/HomeComponent'
import { BrowserRouter } from 'react-router-dom'
import { createBrowserHistory } from 'history'

import './App.css'

const App = () => (
  <BrowserRouter createHistory={createBrowserHistory}>
    <HomeComponent />
  </BrowserRouter>
)

export default App
