import React, { Component } from "react";
import { SpineScene } from "../core/SpineScene.jsx";
import { VideoTexture } from "../core/VideoTexture.jsx";
import { SpineCharacter } from "../objects/SpineCharacter.jsx";
import { SpineBackground } from "../objects/SpineBackground.jsx";
import BACKGROUNDS from "../data/backgrounds.js";

export class Stage extends SpineScene {
  constructor(props) {
    super(props);
    this.characters = [];
    this.background;
    this.effects = {};

    // Internal
    this._backgrounds = [];
  }

  getScale(value, position) {
    if (typeof value === 'string' && value === 'character') {
      switch(position) {
        // Back
        case 0:
        case 2:
        case 4:
        case 6:
          return 0.12;
        // Front
        case 1:
        case 3:
        case 5:
        case 7:
          return 0.148;
        // Center
        case 9:
          return 0.134
        default:
          throw 'Invalid combat position for scale';
      }
    } else {
      return value;
    }
  } 

  getPosition(index) {
    // xShift, yShift, flipX
    //return [70, 40, false]

    switch(index) {
      // Left Front Top
      case 0:
        return [-125, 40, false]
      // Left Front Bottom
      case 1:
        return [-210, -30, false]
      // Left Back Top
      case 2:
        return [-285, 40, false]
      // Left Back Bottom
      case 3:
        return [-405, -30, false]
      // Right Front Top
      case 4:
        return [125, 40, true]
      // Right Front Bottom
      case 5:
        return [210, -30, true]
      // Right Back Top
      case 6:
        return [285, 40, true]
      // Right Back Bottom
      case 7:
        return [405, -30, true]
      // Left Center
      case 8:
        return [-250, 0, true]
      // Right Center
      case 9:
        return [250, 0, true]
      // Left Front Center
      case 10:
        return [-175, 0, true]
      // Right Front Center
      case 11:
        return [175, 0, true]
      // Left Back Center
      case 12:
        return [-385, 0, true]
      // Right Back Center
      case 13:
        return [385, 0, true]
      default:
        throw 'Invalid combat position for position';
    }
  }

  defaultCameraPosition() {
    return {"x":0,"y":120,"z":380};
  }

  componentDidMount() {
    super.componentDidMount(arguments);

    // Construct all skeletons for characters and backgrounds
    this.constructCharacters();
    this.constructBackgrounds();
    this.constructEffects();

    // Begin the animation
    requestAnimationFrame(this.loadSkeletons.bind(this));
  }

  componentWillUpdate(nextProps) {
    if (
        nextProps.effectTest && typeof nextProps.effectTest === 'object' &&
        nextProps.effectTest.hasOwnProperty('src') && nextProps.effectTest.src
    ) {
      let size = nextProps.effectTest.size;
      if (size && typeof size === 'object' && size.hasOwnProperty('width') && size.hasOwnProperty('height')) {
        this.effects.vfx0.setSize(size.width, size.height);
      }

      let pos = nextProps.effectTest.pos;
      if (pos && typeof pos === 'object' && pos.hasOwnProperty('x_pos') && pos.hasOwnProperty('y_pos')) {
        this.effects.vfx0.setPosition(pos.x_pos, pos.y_pos);
      }

      if (nextProps.effectTest.src != this.effects.vfx0.getSrc()) {
        console.log("Setting src:", nextProps.effectTest.src, this.effects.vfx0.getSrc(), nextProps.effectTest.src != this.effects.vfx0.getSrc());
        this.effects.vfx0.setSrc(nextProps.effectTest.src);
        this.effects.vfx0.setLoop(true);
        this.effects.vfx0.play();
      }
    }
  }

  constructEffects() {
    // Create the necessary effect planes
    this.effects = {
      'vfx0' : new VideoTexture(this.scene)
    };

    // For each effect plane, create the effect
    // for now, this is just for a single effect test
    this.effects.vfx0.createEffect();

    /*
    if (
        this.effectTest && typeof this.effectTest === 'object' &&
        this.effectTest.hasOwnProperty('src') && this.effectTest.src
    ) {
      this.setEffectVfx0(
        this.effectTest.src,
        this.effectTest.size,
        this.effectTest.pos
      );
    }
    */
  }

  setEffectVfx0(src, size, pos) {
    this.effects.vfx0.setSrc(src);
    this.effects.vfx0.setSize(size.width, size.height);
    this.effects.vfx0.setPosition(pos.x_pos, pos.y_pos);
    this.effects.vfx0.setLoop(true);
    this.effects.vfx0.play();
  }

  constructCharacters() {
    // Preload all skeleton & atlas files
    for (let index in this.characters) {

      // Determine the skeleton
      let skeleton = "character/MediumMaleHeavySkinTest.json";

      // Allow for overriding the skeleton
      if (this.characters[index].hasOwnProperty('skeleton')) {
        skeleton = this.characters[index].skeleton;
      }

      // Create the Spine object
      this.characters[index].spine = new SpineCharacter(
        this.assetManager, skeleton, index
      );
    }
  }

  constructBackgrounds() {
    if (BACKGROUNDS.hasOwnProperty(this.background)) {
      let key = BACKGROUNDS[this.background].key;
      let features = BACKGROUNDS[this.background].features;
      let animation = BACKGROUNDS[this.background].animation;

      if (typeof features === 'string') {
        this._backgrounds.push(
          new SpineBackground(
            this.assetManager,
            "backgrounds/" + key + "/" + features + ".json",
            animation
          )
        );
      } else {
        for (let _feature of ["Paralax2", "Paralax1", "Midground", "Foreground"]) {
          if (!features.hasOwnProperty(_feature)) continue;
          this._backgrounds.push(
            new SpineBackground(
              this.assetManager,
              "backgrounds/" + key + "/" + _feature + "/" + features[_feature] + ".json",
              animation
            )
          );
        }
      }

      return;
    }

    console.error(`Could not find background ${this.background} in backgrounds list.`);
  }

  loadSkeletons(atlasFile, skeletonFile) {
    if (this.assetManager.isLoadingComplete()) {
      // Create all skeletons
      let skeletons = [];

      // For each background feature, add skeleton
      for (let _bg of this._backgrounds) {
        skeletons.push(_bg.createMesh());
      }

      // Construct the drawing order
      this.characters.sort(((a, b) => {
        return this.getPosition(a.position)[1] < this.getPosition(b.position)[1] ? 1 : -1;
      }).bind(this))

      for (let index in this.characters) {
        // Add to the internal list
        skeletons.push(
          this.characters[index].spine.createMesh(
            this.characters[index].skin,
            this.characters[index].pose,
            ...this.getPosition(this.characters[index].position),
            this.getScale(this.characters[index].scale, this.characters[index].position)
          )
        );

        if (this.characters[index].hasOwnProperty('outfit')) {
          // Outfit URL
          let tag = this.characters[index].outfit[1].toLowerCase();
          let url = `https://neon-district-season-one.s3.us-east-1.amazonaws.com/Output/${tag}/${tag}.json`;

          this.characters[index].spine.loadFullOutfit(
            url,
            this.characters[index].outfit[0].toLowerCase(),
            this.characters[index].outfit[2].toLowerCase()
          );
        }
      }

      this.setSkeletons(skeletons);

      requestAnimationFrame(this.load.bind(this));
    } else requestAnimationFrame(this.loadSkeletons.bind(this));
  }

  getUnitPosition(character) {
    let screen = this.getScreenWorldPosition();

    if (!screen) {
      return null;
    }

    let position = this.getPosition(character.position);
    let scale = this.getScale('character', character.position);

    return {
      feet : {
        x: screen.x + position[0] * screen.fraction,
        y: screen.y - position[1] * screen.fraction
      },
      above : {
        x: screen.x + position[0] * screen.fraction,
        y: screen.y - position[1] * screen.fraction - scale * (character.spine.skeletonData.height * 15/16)
      }
    }
  }
}
