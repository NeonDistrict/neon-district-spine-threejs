import React, { Component } from "react";
import Api from '../api/api.js';
import { Stage } from "../core/Stage.jsx";
import { AnimationController } from "../animation/AnimationController.jsx";
import { SoundManager } from '../sound/SoundManager.jsx';

export class CombatScene extends Stage {
  constructor(props) {
    super(props);
    this.background = props.background;
    this.characters = props.characters || [];

    // Specifically for effects tests
    this.effectTest = props.effectTest;

    // Sounds
    this.soundManager = new SoundManager();

    // Internal objects
    this.animationController = null;
  }

  componentDidMount() {
    super.componentDidMount(arguments);

    // Initialize the animation controller
    this.animationController = new AnimationController(this.characters, this.effects, this.soundManager);
  }

  componentWillUnmount() {
    super.componentWillUnmount(arguments);

    console.log("Clean up videos.");
    for (let key in this.effects) {
      this.effects[key].cleanUpAfterVideo();
    }

    console.log("Clean up audio.");
    this.soundManager.cleanUpAudio();
  }

  renderAdditionalScenes(delta) {
    // Render the game HUD
    if (this.userInterface) {
        this.animationController.update(delta);
        this.userInterface.update(delta);
    }
  }

  runAnimationEventCycle(block, callback) {
    this.animationController.run(block, callback);
  }

}
