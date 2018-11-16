import React from 'react'
import HomeComponent from './molecules/HomeComponent'
import { BrowserRouter } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import { CookiesProvider } from 'react-cookie'

import './App.css'

const App = () => (
  <CookiesProvider>
    <BrowserRouter createHistory={createBrowserHistory}>
      <HomeComponent />
    </BrowserRouter>
  </CookiesProvider>  
)

export default App
