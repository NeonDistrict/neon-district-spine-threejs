import React, { Component } from "react";
import Api from '../api/api.js';
import { Stage } from "../core/Stage.jsx";
import { AnimationController } from "../animation/AnimationController.jsx";

export class CombatScene extends Stage {
  constructor(props) {
    super(props);
    this.background = props.background;
    this.characters = props.characters || [];
    this.effectTest = props.effectTest;

    // Internal objects
    this.animationController = null;
  }

  componentDidMount() {
    super.componentDidMount(arguments);

    // Initialize the animation controller
    this.animationController = new AnimationController(this.characters, this.effects);
  }

  renderAdditionalScenes(delta) {
    // Render the game HUB
    if (this.hud && this.hud.scene && this.hud.camera) {
        this.animationController.update(delta);
        this.userInterface.update(delta);
        this.renderer.render(this.hud.scene, this.hud.camera);
    }
  }

  runAnimationEventCycle(block, callback) {
    this.animationController.run(block, callback);
  }

}
