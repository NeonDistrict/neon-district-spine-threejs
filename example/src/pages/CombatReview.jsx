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
      'scale'    : 'character',
      'skin'     : 'Female',
      'pose'     : 'BladeSml_BaseIdle_001',
      //'outfit'   : ['female', 'natoshi', 'legendary']
    },/*
    {
      'position' : 1,
      'scale'    : 'character',
      'skin'     : 'Male',
      'pose'     : 'EnergyMed_BasicIdle_001',
      'outfit'   : ['male', 'powlock', 'uncommon']
    },*/{
      'position' : 4,
      'scale'    : 'character',
      'skin'     : 'Male',
      'pose'     : 'BladeMed_BaseIdle_001',
      //'outfit'   : ['male', 'cerespreserverr', 'common']
    },/*
    {
      'position' : 5,
      'scale'    : 'character',
      'skin'     : 'Female',
      'pose'     : 'Unarmed_BasicIdle_001',
      'outfit'   : ['female', 'szabodoge', 'legendary']
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
