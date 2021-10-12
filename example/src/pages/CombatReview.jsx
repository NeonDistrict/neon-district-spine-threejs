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
    this.setState({'battleId' : el.value, 'playback' : true});
  }

  render() {
    let characters = [{
      'position'  : 0,
      'nftId'     : "test0",
      'scale'     : 'character',
      'skin'      : 'Male',
      'weapon'    : 'blkoriginpulsarv16-legendary',
      'jsonFile'  : 'spine-output/character/MediumMaleHeavySkinTest-1-spine.json',
      'outfit'   : ['male', 'uncontrolledpresaledemon', 'rare']
    },{
      'position' : 1,
      'nftId'    : "test1",
      'scale'    : 'character',
      'skin'     : 'Male',
      'weapon'   : 'blkglassshard-legendary',
      'jsonFile'  : 'spine-output/character/MediumMaleHeavySkinTest-1-spine.json',
      'outfit'   : ['male', 'uncontrolledpresaledoctor', 'legendary']
    },{
      'position'  : 2,
      'nftId'     : "test2",
      'scale'     : 'character',
      'skin'      : 'Female',
      'weapon'    : 'blkoriginpulsarv16-rare',
      'jsonFile'  : 'spine-output/character/MediumMaleHeavySkinTest-1-spine.json',
      'outfit'   : ['female', 'uncontrolledpresalejack', 'uncommon']
    },{
      'position' : 3,
      'nftId'    : "test3",
      'scale'    : 'character',
      'skin'     : 'Female',
      'weapon'   : 'blkpartnerrevelatorz17-ultrarare',
      'jsonFile'  : 'spine-output/character/MediumMaleHeavySkinTest-1-spine.json',
      'outfit'   : ['female', 'blkspecialneonpizzaagentr', 'legendary']
    },{
      'position' : 4,
      'nftId'    : "test4",
      'scale'    : 'character',
      'skin'     : 'Female',
      'weapon'   : 'blkspecialdeathknightsword-legendary',
      'jsonFile'  : 'spine-output/character/MediumMaleHeavySkinTest-1-spine.json',
      'outfit'   : ['female', 'blkspecialdeathknight', 'legendary']
    },{
      'position' : 5,
      'nftId'    : "test5",
      'scale'    : 'character',
      'skin'     : 'Male',
      'weapon'   : 'blkoriginsaltas-ultrarare',
      'jsonFile'  : 'spine-output/character/MediumMaleHeavySkinTest-1-spine.json',
      'outfit'   : ['male', 'uncontrolledpresaleghost', 'legendary', '000']
    },{
      'position' : 6,
      'nftId'    : "test6",
      'scale'    : 'character',
      'skin'     : 'Male',
      'weapon'   : 'blkprotectionorb-rare',
      'jsonFile'  : 'spine-output/character/MediumMaleHeavySkinTest-1-spine.json',
      'outfit'   : ['male', 'blkspecialneonpizzaagentp', 'legendary']
    },{
      'position' : 7,
      'nftId'    : "test7",
      'scale'    : 'character',
      'skin'     : 'Male',
      'weapon'   : 'blkbluebolt-uncommon',
      'jsonFile'  : 'spine-output/character/MediumMaleHeavySkinTest-1-spine.json',
      'outfit'   : ['male', 'plasmabearssuit', 'legendary']
    }];

    function getScreenSize() {
      let width = 1536, height = 864;

      if (window.innerWidth < 1605) {
        width = 1440;
        height = 810;
      }

      if (window.innerWidth < 1605) {
        width = 1366;
        height = 768;
      }

      if (window.innerWidth < 1370) {
        width = 1280;
        height = 720;
      }

      if (window.innerWidth < 1285) {
        width = 1152;
        height = 648;
      }

      if (window.innerWidth < 1157) {
        width = 1024;
        height = 576;
      }

      if (window.innerWidth < 1029) {
        width = 960;
        height = 540;
      }

      return {width, height}
    }

    let size = getScreenSize();

    return (
      <div>
        <div style={size}>
          <NDCombatPlayer
            //baseUrl={"http://localhost:3000/"}
            //baseUrl={"https://neon-district-season-one.s3.amazonaws.com/"}
            width={size.width}
            height={size.height}
            background="quarter-leatherheadz-unchained-bar-ext-001"
            characters={characters}
            //combatApi={"http://localhost:5003"}
            combatSocket={"http://localhost:5003"}
            playback={this.state.playback}
            battleId={this.state.battleId}
            teamId={1}
            key={this.state.battleId}
            //perks={{
            //  "music" : [
            //    "bt-laurel-canyon-loop",
            //    "bt-laurel-canyon-night-loop",
            //    "bt-laurel-canyon-lunar-loop"
            //  ]
            //}}
            //createOptions={{
            //  "aiTeam" : {
            //    "0" : {"test":"test"}/*,
            //    "1" : {"test":"test"},
            //    "2" : {"test":"test"},
            //    "3" : {"test":"test"}*/
            //  }
            //}}
          />
        </div>
        {this.generateBattleIdField()}
      </div>
    );
  }
}
