import React, { Component } from "react";
import Api from '../api/api.js';
import { Stage } from "../core/Stage.jsx";
import { CombatHUD } from "../objects/CombatHUD.jsx";

export class CombatScene extends Stage {
  constructor(props) {
    super(props);
    this.background = props.background;
    this.characters = props.characters || [];
    this.effectTest = props.effectTest;

    // Internal objects
    this.userInterface = null;
    this.hud = null;
  }

  componentDidMount() {
    super.componentDidMount(arguments);

    // Draw Game UI elements
    this.drawHUD();
  }

  drawHUD() {
    this.userInterface = new CombatHUD(this.renderer);
    this.hud = this.userInterface.render();
  }

  renderAdditionalScenes(delta) {
    // Render the game HUB
    if (this.hud && this.hud.scene && this.hud.camera) {
        this.userInterface.update(delta);
        this.renderer.render(this.hud.scene, this.hud.camera);
    }
  }

}
