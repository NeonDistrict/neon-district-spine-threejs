import React, { Component } from "react";
import { BrowserRouter as Router, Route } from 'react-router-dom'

import Navigation from "./components/Navigation";
import Background from "./components/Background";

import Home from "./pages/Home";
import CombatTest from "./pages/CombatTest";
import CharacterEquipment from "./pages/CharacterEquipment";
import CombatScene from "./pages/CombatScene";
import BackgroundReview from "./pages/BackgroundReview";

export default class App extends Component {
  render() {
    return (
    
      <Router>

        <Navigation />
        <Background />

        <div className="container">

          <Route exact path="/" component={Home} />
          <Route path="/combat-test" component={CombatTest} />
          <Route path="/background-review" component={BackgroundReview} />
          <Route path="/character-equipment" component={CharacterEquipment} />
          <Route path="/combat-scene" component={CombatScene} />

        </div>

      </Router>

    )
  }
}


