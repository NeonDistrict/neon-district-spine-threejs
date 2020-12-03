import React, { Component } from "react";
import { NDCombatPlayer } from "neon-district-spine-threejs";

export default class CombatReview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      'battleId' : 'test',
      'playback' : true
    };
  }

  componentDidMount() {
    window.addEventListener("getBattleInformation", (e) => {
      document.getElementById('battleId').value = e.detail.battleId;
    });
  }

  generateBattleIdField() {
    return (
      <span>
        <label htmlFor="battleId">
          Battle ID:
          <input type="text" style={{width: "20em", margin: "0 5px 0 2px"}} name="battleId" id="battleId" />
        </label>
        <button onClick={this.setBattleId.bind(this)}>
          Update
        </button>
      </span>
    );
  }

  setBattleId() {
    let el = document.getElementById('battleId');
    this.setState({'battleId' : el.value, 'playback' : false});
  }

  render() {
    let characters = [{
      'position' : 0,
      'nftId'    : "test0",
      'scale'    : 'character',
      'skin'     : 'Female',
      'pose'     : 'ReturningLrg_BasicIdle_001',
      //'outfit'   : ['female', 'blkorigindemon', 'common']
    },{
      'position' : 1,
      'nftId'    : "test1",
      'scale'    : 'character',
      'skin'     : 'Male',
      'pose'     : 'EnergyMed_BasicIdle_001',
      //'outfit'   : ['male', 'blkoriginmedic', 'common']
    },{
      'position' : 2,
      'nftId'    : "test2",
      'scale'    : 'character',
      'skin'     : 'Female',
      'pose'     : 'RifleMed_BasicIdle_001',
      //'outfit'   : ['female', 'blkorigingenius', 'common']
    },
    {
      'position' : 3,
      'nftId'    : "test3",
      'scale'    : 'character',
      'skin'     : 'Male',
      'pose'     : 'ConsoleSml_BasicIdle_001',
      //'outfit'   : ['male', 'blkoriginghost', 'common']
    },{
      'position' : 4,
      'nftId'    : "test4",
      'scale'    : 'character',
      'skin'     : 'Female',
      'pose'     : 'BladeMed_BaseIdle_001',
      //'outfit'   : ['female', 'blkoriginheavy', 'common']
    },
    {
      'position' : 5,
      'nftId'    : "test5",
      'scale'    : 'character',
      'skin'     : 'Male',
      'pose'     : 'DualRangedSml_BasicIdle_001',
      //'outfit'   : ['male', 'blkoriginjack', 'common']
    },
    {
      'position' : 6,
      'nftId'    : "test6",
      'scale'    : 'character',
      'skin'     : 'Female',
      'pose'     : 'ThrustingSml_BaseIdle_001',
      //'outfit'   : ['female', 'blkoriginmedic', 'common']
    },
    {
      'position' : 7,
      'nftId'    : "test7",
      'scale'    : 'character',
      'skin'     : 'Male',
      'pose'     : 'DualRangedMed_BasicIdle_001',
      //'outfit'   : ['male', 'blkorigingenius', 'common']
    }];

    return (
      <div>
        <div style={{"width":1280,"height":768}}>
          <NDCombatPlayer
            width={1280}
            height={768}
            background="almond-uncontrolled-lobby-001"
            characters={characters}
            //combatApi={"http://localhost:5003"}
            combatSocket={"http://localhost:5003"}
            playback={this.state.playback}
            battleId={this.state.battleId}
            teamId={1}
            key={this.state.battleId}
          />
        </div>
        {this.generateBattleIdField()}
      </div>
    );
  }
}
