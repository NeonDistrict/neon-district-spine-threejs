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

  componentWillUpdate(nextProps) {
    for (let _prop in nextProps) {
      if (this.props[_prop] !== nextProps[_prop]) {
        if (_prop === 'animation') {
          this.character.setAnimation(nextProps[_prop]);
        } else if (_prop === 'gender') {
          this.character.setSkin(nextProps["gender"] === 'male' ? 'Male' : 'Female');
          this.character.loadGear("head", nextProps["head"], nextProps["gender"], nextProps["headRarity"]);
          this.character.loadGear("body", nextProps["body"], nextProps["gender"], nextProps["bodyRarity"]);
          this.character.loadGear("arms", nextProps["arms"], nextProps["gender"], nextProps["armsRarity"]);
          this.character.loadGear("legs", nextProps["legs"], nextProps["gender"], nextProps["legsRarity"]);
        } else if (_prop.indexOf("head") !== -1) {
          this.character.loadGear("head", nextProps["head"], nextProps["gender"], nextProps["headRarity"]);
        } else if (_prop.indexOf("body") !== -1) {
          this.character.loadGear("body", nextProps["body"], nextProps["gender"], nextProps["bodyRarity"]);
        } else if (_prop.indexOf("arms") !== -1) {
          this.character.loadGear("arms", nextProps["arms"], nextProps["gender"], nextProps["armsRarity"]);
        } else if (_prop.indexOf("legs") !== -1) {
          this.character.loadGear("legs", nextProps["legs"], nextProps["gender"], nextProps["legsRarity"]);
        }
      }
    }
    
  }

  loadSkeletons(atlasFile, skeletonFile) {
    if (this.assetManager.isLoadingComplete()) {
      this.setSkeletons([
         this.character.createMesh(this.props.gender === 'male' ? 'Male' : 'Female', this.props.animation, 0, 40, false, 0.12)
      ]);

      this.character.debug();
      //this.character.loadTexture("https://neon-district-season-one.s3.amazonaws.com/Output/blkspecialdeathknight/male/legendary/torsotop.png", "Torsotop");

      /*
      this.character.loadFullOutfit(
        "https://neon-district-season-one.s3.us-east-1.amazonaws.com/Output/blkspecialdeathknight/blkspecialdeathknight.json",
        "male",
        "legendary"
      );
      */

      for (let part of ["head","body","arms","legs"]) {
        this.character.loadGear(
          part,
          "https://neon-district-season-one.s3.us-east-1.amazonaws.com/Output/" + this.props[part] + "/" + this.props[part] + ".json",
          this.props.gender,
          this.props[part + "Rarity"]
        );
      }

      requestAnimationFrame(this.load.bind(this));
    } else requestAnimationFrame(this.loadSkeletons.bind(this));
  }
}
