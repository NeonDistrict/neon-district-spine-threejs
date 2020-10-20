import React, { Component } from "react";
import { NDCombatPlayer } from "neon-district-spine-threejs";

export default class CombatReview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      'battleId' : 'test',
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
        <label for="battleId">
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
    this.setState({'battleId' : el.value});
  }

  render() {
    let characters = [{
      'position' : 0,
      'nftId'    : "test0",
      'scale'    : 'character',
      'skin'     : 'Female',
      'pose'     : 'ReturningLrg_BasicIdle_001',
      'outfit'   : ['female', 'blkorigindemon', 'common']
    },/*{
      'position' : 1,
      'nftId'    : "test1",
      'scale'    : 'character',
      'skin'     : 'Male',
      'pose'     : 'EnergyMed_BasicIdle_001',
      //'outfit'   : ['male', 'poscrypno', 'ultrarare']
    },{
      'position' : 2,
      'nftId'    : "test2",
      'scale'    : 'character',
      'skin'     : 'Male',
      'pose'     : 'RifleMed_BasicIdle_001',
      //'outfit'   : ['male', 'zenoautomatorr', 'rare']
    },
    {
      'position' : 3,
      'nftId'    : "test3",
      'scale'    : 'character',
      'skin'     : 'Female',
      'pose'     : 'ConsoleSml_BasicIdle_001',
      //'outfit'   : ['female', 'powlock', 'uncommon']
    },*/{
      'position' : 4,
      'nftId'    : "test4",
      'scale'    : 'character',
      'skin'     : 'Female',
      'pose'     : 'BladeMed_BaseIdle_001',
      'outfit'   : ['female', 'blkoriginheavy', 'common']
    }/*,
    {
      'position' : 5,
      'nftId'    : "test5",
      'scale'    : 'character',
      'skin'     : 'Female',
      'pose'     : 'Unarmed_BasicIdle_001',
      //'outfit'   : ['female', 'szabowasp', 'rare']
    },
    {
      'position' : 6,
      'nftId'    : "test6",
      'scale'    : 'character',
      'skin'     : 'Female',
      'pose'     : 'ThrustingSml_BaseIdle_001',
      //'outfit'   : ['female', 'szabodoge', 'legendary']
    },
    {
      'position' : 7,
      'nftId'    : "test7",
      'scale'    : 'character',
      'skin'     : 'Male',
      'pose'     : 'DualRangedMed_BasicIdle_001',
      //'outfit'   : ['male', 'yumeforgerp', 'ultrarare']
    }*/];

    return (
      <div>
        <div style={{"width":1024,"height":600}}>
          <NDCombatPlayer
            width={1024}
            height={600}
            background="almond-uncontrolled-lobby-001"
            characters={characters}
            combatApi={"http://localhost:5003"}
            battleId={this.state.battleId}
            key={this.state.battleId}
          />
        </div>
        {this.generateBattleIdField()}
      </div>
    );
  }
}
