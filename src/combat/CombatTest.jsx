import React, { Component } from "react";
import { SpineScene } from "../core/SpineScene.jsx";
import { SpineCharacter } from "../objects/SpineCharacter.jsx";
import { SpineBackground } from "../objects/SpineBackground.jsx";

export class CombatTest extends SpineScene {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    super.componentDidMount(arguments);

    // Preload all skeleton & atlas files
    this.character = new SpineCharacter(this.assetManager, "MediumMaleHeavySkinTest.json");
    this.background = new SpineBackground(this.assetManager, "Paralax1/S0_MetrostationInterior_001_SkeletonData.json");
    this.foreground = new SpineBackground(this.assetManager, "Midground/S0_MetrostationInterior_001_SkeletonData.json");

    // Begin the animation
    requestAnimationFrame(this.loadSkeletons.bind(this));
  }

  loadSkeletons(atlasFile, skeletonFile) {
    if (this.assetManager.isLoadingComplete()) {
      // Create all skeletons
      this.setSkeletons([
        this.background.createMesh(),
        this.foreground.createMesh(),
        this.character.createMesh(-50, 40, 0.12, false, 'Female'),
        this.character.createMesh(50, 40, 0.12, false, 'Male')
      ]);

      requestAnimationFrame(this.load.bind(this));
    } else requestAnimationFrame(this.loadSkeletons.bind(this));
  }
}
