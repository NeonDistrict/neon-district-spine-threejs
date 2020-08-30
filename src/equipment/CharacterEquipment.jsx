import React, { Component } from "react";
import { SpineScene } from "../core/SpineScene.jsx";
import { SpineCharacter } from "../objects/SpineCharacter.jsx";
import { SpineBackground } from "../objects/SpineBackground.jsx";

export class CharacterEquipment extends SpineScene {
  constructor(props) {
    super(props);
  }

  defaultCameraPosition() {
    return {"x":0,"y":150,"z":200};
  }

  componentDidMount() {
    super.componentDidMount(arguments);

    // Preload all skeleton & atlas files
    this.character = new SpineCharacter(this.assetManager, "MediumMaleHeavySkinTest.json");

    // Begin the animation
    requestAnimationFrame(this.loadSkeletons.bind(this));
  }

  loadSkeletons(atlasFile, skeletonFile) {
    if (this.assetManager.isLoadingComplete()) {
      this.setSkeletons([
         this.character.createMesh('Male', 'Unarmed_BasicIdle_001', 0, 40, false, 0.12)
      ]);

      this.character.debug();
      //this.character.loadTexture("https://neon-district-season-one.s3.amazonaws.com/Output/blkspecialdeathknight/male/legendary/torsotop.png", "Torsotop");

      this.character.loadFullOutfit(
        "https://neon-district-season-one.s3.us-east-1.amazonaws.com/Output/blkspecialdeathknight/blkspecialdeathknight.json",
        "male",
        "legendary"
      );

      requestAnimationFrame(this.load.bind(this));
    } else requestAnimationFrame(this.loadSkeletons.bind(this));
  }
}
