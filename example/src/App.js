import React, { Component } from "react";
import { BrowserRouter as Router, Route } from 'react-router-dom'

import Navigation from "./components/Navigation";
import Background from "./components/Background";

import Home from "./pages/Home";
import Test from "./pages/Test";

export default class App extends Component {
  render() {
    return (
    
      <Router>

        <Navigation />
        <Background />

        <div className="container">

          <Route exact path="/" component={Home} />
          <Route path="/test" component={Test} />

        </div>

      </Router>

    )
  }
}


