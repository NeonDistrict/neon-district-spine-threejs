import React, { Component } from "react";
import { BrowserRouter as Router, Route } from 'react-router-dom'

import Navigation from "./components/Navigation";
import Background from "./components/Background";

import Home from "./pages/Home";
import Test from "./pages/Test";
import CubeTest from "./pages/CubeTest";
import CombatTest from "./pages/CombatTest";

export default class App extends Component {
  render() {
    return (
    
      <Router>

        <Navigation />
        <Background />

        <div className="container">

          <Route exact path="/" component={Home} />
          <Route path="/test" component={Test} />
          <Route path="/cube-test" component={CubeTest} />
          <Route path="/combat-test" component={CombatTest} />

        </div>

      </Router>

    )
  }
}


