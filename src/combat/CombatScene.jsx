import React, { Component } from "react";
import Api from '../api/api.js';
import { Stage } from "../core/Stage.jsx";
import { AnimationController } from "../animation/AnimationController.jsx";
import { ImageCache } from '../objects/ImageCache.jsx';
import { SoundManager } from '../sound/SoundManager.jsx';

export class CombatScene extends Stage {
  constructor(props) {
    super(props);
    this.background = props.background;
    this.characters = props.characters || [];

    // Specifically for effects tests
    this.effectTest = props.effectTest;

    // Load the image cache early on
    this.imageCache = new ImageCache();
    this.imageCache.pullImages();

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
