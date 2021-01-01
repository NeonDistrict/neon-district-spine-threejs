import React, { Component } from "react";
import { BrowserRouter as Router, Route } from 'react-router-dom'

import Navigation from "./components/Navigation";
import Background from "./components/Background";

import Home from "./pages/Home";
import CharacterEquipment from "./pages/CharacterEquipment";
import CombatReview from "./pages/CombatReview";
import CombatScene from "./pages/CombatScene";
import BackgroundReview from "./pages/BackgroundReview";
import EffectCreator from "./pages/EffectCreator";
import EffectReview from "./pages/EffectReview";

export default class App extends Component {
  render() {
    return (
    
      <Router>

        <Navigation />
        <Background />

        <div className="container">

          <Route exact path="/" component={Home} />
          <Route path="/background-review" component={BackgroundReview} />
          <Route path="/effect-review" component={EffectReview} />
          <Route path="/effect-creator" component={EffectCreator} />
          <Route path="/character-equipment" component={CharacterEquipment} />
          <Route path="/combat-review" component={CombatReview} />
          <Route path="/combat-scene" component={CombatScene} />

        </div>

      </Router>

    )
  }
}


