import React, { Component } from "react";
import Api from '../api/api.js';
import { Stage } from "../core/Stage.jsx";

export class CombatScene extends Stage {
  constructor(props) {
    super(props);
    this.background = props.background;
    this.characters = props.characters || [];
    this.effectTest = props.effectTest; 
    this.combatApi  = props.combatApi;
    this.battleId   = props.battleId;
  }

  componentDidMount() {
    super.componentDidMount(arguments);

    // Capture & handle click events
    this.canvas.addEventListener('click', this.handleCanvasClick.bind(this));

    // Pull the initial battle state
    let api = new Api(this.combatApi);
    api.getBattle({battleId: this.battleId}, () => {
        console.log("result");
        console.log(arguments);
    }, () => {
        console.error("error");
        console.error(arguments);
    });
  }

  handleCanvasClick() {
    this.runCombat();
  }

  runCombat() {
    let api = new Api(this.combatApi);
    api.runBattle({
        battleId: this.battleId,
        action:'atk',
        target:0,
        automatic:false
    }, () => {
        console.log("result");
        console.log(arguments);
    }, () => {
        console.error("error");
        console.error(arguments);
    });
  }

}
