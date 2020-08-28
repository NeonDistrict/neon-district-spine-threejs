import React, { Component } from "react";
import { SpineScene } from "../core/SpineScene.jsx";
import { SpineCharacter } from "../objects/SpineCharacter.jsx";
import { SpineBackground } from "../objects/SpineBackground.jsx";

export class CharacterEquipment extends SpineScene {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    super.componentDidMount(arguments);

    // Preload all skeleton & atlas files
    this.character = new SpineCharacter(this.assetManager, "MediumMaleHeavySkinTest.json");

    // Begin the animation
    requestAnimationFrame(this.loadSkeletons.bind(this));
  }

  loadTextureImage(path, _skeletonMesh) {
    const img = new Image();
    img.onload = function() {
      let spineTexture = new spine.threejs.ThreeJsTexture(img);
      _skeletonMesh.skeleton.findSlot('Torso Base').attachment.region.texture = spineTexture;
    };
    img.src = path;
  }

  loadSkeletons(atlasFile, skeletonFile) {
    if (this.assetManager.isLoadingComplete()) {
      // Create all skeletons
      let skeletonMesh1 = this.character.createMesh(-40, 40, 0.12, false, 'Male');

      // Create all skeletons
      let skeletonMesh2 = this.character.createMesh(60, 40, 0.12, false, 'Male');

      // Copy the existing skin
      let newSkin = new spine.Skin("char-equip");
      newSkin.copySkin(skeletonMesh1.skeleton.skin);
      skeletonMesh1.skeleton.setSkin(newSkin);
      console.log(newSkin);

      //https://rawgit.com/EsotericSoftware/spine-runtimes/3.8/spine-ts/webgl/demos/skins.js
      //

      this.loadTextureImage(
        "./spine-assets/male-body-test.png",
        skeletonMesh1
      );

      this.setSkeletons([
        skeletonMesh1,
        skeletonMesh2
      ]);

      requestAnimationFrame(this.load.bind(this));
    } else requestAnimationFrame(this.loadSkeletons.bind(this));
  }
}
