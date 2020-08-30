import React, { Component } from "react";
import { SpineScene } from "../core/SpineScene.jsx";
import { SpineCharacter } from "../objects/SpineCharacter.jsx";
import { SpineBackground } from "../objects/SpineBackground.jsx";

export class CombatTest extends SpineScene {
  constructor(props) {
    super(props);
  }

  defaultCameraPosition() {
    return {"x":0,"y":200,"z":400};
  }

  componentDidMount() {
    super.componentDidMount(arguments);

    // Preload all skeleton & atlas files
    this.characterM = new SpineCharacter(this.assetManager, "MediumMaleHeavySkinTest.json", "M");
    this.characterF = new SpineCharacter(this.assetManager, "MediumMaleHeavySkinTest.json", "F");
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
        this.characterF.createMesh('Female', 'BladeSml_BaseIdle_001', 70, 40, false, 0.12),
        this.characterM.createMesh('Male', 'EnergyMed_BasicIdle_001', -70, 40, false, 0.12)
      ]);

      this.characterF.loadFullOutfit(
        "https://neon-district-season-one.s3.us-east-1.amazonaws.com/Output/natoshi/natoshi.json",
        "female",
        "legendary"
      );

      this.characterM.loadFullOutfit(
        "https://neon-district-season-one.s3.us-east-1.amazonaws.com/Output/powlock/powlock.json",
        "male",
        "uncommon"
      );

      requestAnimationFrame(this.load.bind(this));
    } else requestAnimationFrame(this.loadSkeletons.bind(this));
  }
}
