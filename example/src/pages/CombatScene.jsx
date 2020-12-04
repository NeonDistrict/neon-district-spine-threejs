import React, { Component } from "react";
import { NDCombatScene } from "neon-district-spine-threejs";

export default class CombatScene extends Component {
  render() {
    let characters = [{
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
    },
    {
      'position' : 4,
      'scale'    : 0.08,
      'skin'     : 'SMFS',
      'skeleton' : 'spine-output/enemies/junkbot-turret/Junkbot_Turret.json',
      'pose'     : 'Idle_Shaky'
    },
    {
      'position' : 5,
      'scale'    : 0.175,
      'skin'     : 'COG_Hare_B',
      'skeleton' : 'spine-output/enemies/cog-hare/COG_Hare.json',
      'pose'     : 'Idle'
    },
    {
      'position' : 13,
      'scale'    : 0.7,
      'skin'     : 'default',
      'skeleton' : 'spine-output/enemies/baus/Cog_Boss.json',
      'pose'     : 'Idle'
    }];

    return (
      <div style={{"width":1024,"height":600}}>
        <NDCombatScene
          width={1024}
          height={600}
          background="training-room-001"
          characters={characters}
        />
      </div>
    );
  }
}
