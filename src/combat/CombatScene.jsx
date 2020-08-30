import React, { Component } from "react";
import { SpineScene } from "../core/SpineScene.jsx";
import { SpineCharacter } from "../objects/SpineCharacter.jsx";
import { SpineBackground } from "../objects/SpineBackground.jsx";

export class CombatScene extends SpineScene {
  constructor(props) {
    super(props);
    this.characters = [{
      'position' : 0,
      'scale'    : 'character',
      'skin'     : 'Female',
      'pose'     : 'BladeSml_BaseIdle_001',
      'outfit'   : ['female', 'natoshi', 'legendary']
    },
    {
      'position' : 1,
      'scale'    : 'character',
      'skin'     : 'Male',
      'pose'     : 'EnergyMed_BasicIdle_001',
      'outfit'   : ['male', 'powlock', 'uncommon']
    },{
      'position' : 2,
      'scale'    : 'character',
      'skin'     : 'Male',
      'pose'     : 'BladeMed_BaseIdle_001',
      'outfit'   : ['male', 'blkorigingenius', 'common']
    },
    {
      'position' : 3,
      'scale'    : 'character',
      'skin'     : 'Female',
      'pose'     : 'Unarmed_BasicIdle_001',
      'outfit'   : ['female', 'cerespreserverr', 'rare']
    },{
      'position' : 4,
      'scale'    : 'character',
      'skin'     : 'Female',
      'pose'     : 'ConsoleMed_BasicIdle_001',
      'outfit'   : ['female', 'lightningheroes', 'legendary']
    },
    {
      'position' : 5,
      'scale'    : 'character',
      'skin'     : 'Male',
      'pose'     : 'EnergyMed_BasicIdle_001',
      'outfit'   : ['male', 'posstakes', 'ultrarare']
    },/*{
      'position' : 6,
      'scale'    : 'character',
      'skin'     : 'Male',
      'pose'     : 'DualMeleeSml_BasicIdle_001',
      'outfit'   : ['male', 'vicesquadwirehead', 'common']
    },
    {
      'position' : 7,
      'scale'    : 'character',
      'skin'     : 'Female',
      'pose'     : 'ThrustingMed_BaseIdle_001',
      'outfit'   : ['female', 'yumeforgerp', 'uncommon']
    },*/
    {
      'position' : 13,
      'scale'    : 0.7,
      'skin'     : 'default',
      'skeleton' : 'Cog_Boss.json',
      'pose'     : 'Idle'
    }];
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
          throw 'Invalid combat position';
      }
    } else {
      return value;
    }
  } 

  getPosition(index) {
    // xShift, yShift, scale, flipX
    //return [70, 40, 0.12, false]

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
        throw 'Invalid combat position';
    }
  }

  defaultCameraPosition() {
    return {"x":0,"y":200,"z":400};
  }

  componentDidMount() {
    super.componentDidMount(arguments);

    // Preload all skeleton & atlas files
    for (let index in this.characters) {
      // Determine the skeleton
      let skeleton = "MediumMaleHeavySkinTest.json";
      if (this.characters[index].hasOwnProperty('skeleton')) {
        skeleton = this.characters[index].skeleton;
      }

      this.characters[index].spine = new SpineCharacter(
        this.assetManager, skeleton, index
      );
    }

    this.background = new SpineBackground(this.assetManager, "Paralax1/S0_MetrostationInterior_001_SkeletonData.json");
    this.foreground = new SpineBackground(this.assetManager, "Midground/S0_MetrostationInterior_001_SkeletonData.json");

    // Begin the animation
    requestAnimationFrame(this.loadSkeletons.bind(this));
  }

  loadSkeletons(atlasFile, skeletonFile) {
    if (this.assetManager.isLoadingComplete()) {
      // Create all skeletons
      let skeletons = [
        this.background.createMesh(),
        this.foreground.createMesh()
      ];

      // Construct the drawing order
      this.characters.sort(((a, b) => {
        return this.getPosition(a.position)[1] < this.getPosition(b.position)[1] ? 1 : -1;
      }).bind(this))

      for (let index in this.characters) {
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

      /*
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
      */

      requestAnimationFrame(this.load.bind(this));
    } else requestAnimationFrame(this.loadSkeletons.bind(this));
  }
}
