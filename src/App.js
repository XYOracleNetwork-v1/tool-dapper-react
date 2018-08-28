import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import HomeComponent from './molecules/HomeComponent';

import './App.css';

const App = () => (
  <Router createHistory={createBrowserHistory}>
    <div className="App">
      <Route path="/" component={HomeComponent} />
    </div>
  </Router>
);

export default App;
