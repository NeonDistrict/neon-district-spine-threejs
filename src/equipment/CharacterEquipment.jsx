import React, { Component } from "react";
import { SpineScene } from "../core/SpineScene.jsx";
import { SpineCharacter } from "../objects/SpineCharacter.jsx";
import { SpineDrone } from "../objects/SpineDrone.jsx";
import { SpineBackground } from "../objects/SpineBackground.jsx";
import DRONES from "../data/drones.js";

export class CharacterEquipment extends SpineScene {
  constructor(props) {
    super(props);
  }

  defaultCameraPosition() {
    return {"x":0,"y":150,"z":200};
  }

  componentDidMount() {
    super.componentDidMount(arguments);

    // Drones
    let drone = ["",""];
    if (this.isDroneWeapon(this.props["weapon"])) {
      drone = [this.props["weapon"], this.props["weaponRarity"]];
    }

    // Preload all skeleton & atlas files
    this.character = new SpineCharacter(this.assetManager, this.props.jsonFile || "spine-output/character/MediumMaleHeavySkinTest.json");
    this.drone = new SpineDrone(this.assetManager, "spine-output/weapons/Blkpartnerdrone.json", drone[0], drone[1], -1);

    // Begin the animation
    requestAnimationFrame(this.loadSkeletons.bind(this));
  }

  componentWillUpdate(nextProps) {
    for (let _prop in nextProps) {
      if (this.props[_prop] !== nextProps[_prop]) {
        if (_prop === 'animation') {
          this.character.setAnimation(nextProps[_prop]);
        } else if (_prop === 'skinTone') {
          this.character.setSkinTone(nextProps["skinTone"]);
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
        } else if (_prop.indexOf("weapon") !== -1) {
          this.character.loadGear("weapon", nextProps["weapon"], nextProps["gender"], nextProps["weaponRarity"]);

          // Create the Drone object if needed
          if (nextProps["weapon"] && this.isDroneWeapon(nextProps["weapon"])) {
            this.drone.setDrone(nextProps["weapon"], nextProps["weaponRarity"]);
            this.drone.clearTexture();
            this.drone.loadDroneImage();
          } else {
            this.drone.clearTexture();
            this.drone.renderTexture();
          }
        }
      }
    }
  }

  isDroneWeapon(weapon = "") {
    return DRONES.hasOwnProperty(weapon);
  }

  loadSkeletons(atlasFile, skeletonFile) {
    if (this.assetManager.isLoadingComplete()) {

      this.setSkeletons([
        this.drone.createMesh(-20, -300, false, 0.132),
        this.character.createMesh(this.props.gender === 'male' ? 'Male' : 'Female', this.props.animation, 0, 40, false, 0.12)
      ]);

      // Create the character's canvas before loading gear
      this.character.createCanvas();

      // Set all available parts
      /*
      for (let part of ["head","body","arms","legs","weapon"]) {
        this.character.loadGear(
          part,
          this.props[part],
          this.props.gender,
          this.props[part + "Rarity"]
        );
      }

      // Set the skin tone
      this.character.setSkinTone(this.props.skinTone);
      */

      // Hide drone
      this.drone.createCanvas();
      this.drone.clearTexture();
      this.drone.renderTexture();

      // Load drone image if possible
      if (this.drone.drone && this.drone.rarity) {
        this.drone.loadDroneImage();
      }

      requestAnimationFrame(this.load.bind(this));
    } else requestAnimationFrame(this.loadSkeletons.bind(this));
  }
}
