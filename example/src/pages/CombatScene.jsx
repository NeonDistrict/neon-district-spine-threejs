import React, { Component } from "react";
import { NDCombatScene } from "neon-district-spine-threejs";

export default class CombatScene extends Component {
  render() {
    let characters = [{
      'position' : 0,
      'scale'    : 'character',
      'skin'     : 'Female',
      'weapon'   : 'blkoriginheater-rare',
      'outfit'   : ['female', 'natoshi', 'legendary']
    },
    {
      'position' : 1,
      'scale'    : 'character',
      'skin'     : 'Male',
      'weapon'   : 'blkpartnerrevelatorz17-ultrarare',
      'outfit'   : ['male', 'powlock', 'uncommon']
    },{
      'position' : 2,
      'scale'    : 'character',
      'skin'     : 'Male',
      'weapon'   : 'blkoriginnightsticks-uncommon',
      'outfit'   : ['male', 'blkorigingenius', 'common']
    },
    {
      'position' : 3,
      'scale'    : 'character',
      'skin'     : 'Female',
      'weapon'   : 'blkchakram-legendary',
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
      <div style={{"width":1280,"height":768}}>
        <NDCombatScene
          width={1280}
          height={768}
          background="corp-office-int-night-001"
          characters={characters}
        />
      </div>
    );
  }
}
