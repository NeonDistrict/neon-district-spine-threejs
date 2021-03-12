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
      'skin'      : 'Female',
      'weapon'    : 'blkoriginpulsarv16-rare',
      //'jsonFile'  : 'nfts/ai-practice/ai-practice-blkorigindemon-female-4-0-spine.json',
      'atlasFile' : 'nfts/ai-practice/ai-practice-blkorigindemon-female-4-0-spine.atlas',
      //'atlasFile' : 'spine-output/character/MediumMaleHeavySkinTest.atlas',
      //'jsonFile'  : 'spine-output/character/MediumMaleHeavySkinTest.json',
      'outfit'   : ['female', 'blkorigindemon', 'common']
    },{
      'position' : 1,
      'nftId'    : "test1",
      //'nftId'    : "ai-practice-blkorigindemon-female-0",
      'weapon'   : 'blkoriginwristbox-legendary',
      'scale'    : 'character',
      'skin'     : 'Female',
      'atlasFile' : 'nfts/ai-practice/ai-practice-blkoriginghost-female-5-0-spine.atlas',
      //'outfit'   : ['male', 'blkoriginmedic', 'common']
    },/*{
      'position' : 2,
      'nftId'    : "79228162551158388693916474895",
      'scale'    : 'character',
      'skin'     : 'Female',
      'weapon'   : 'blktwintanto-rare',
      'atlasFile' : 'nfts/ai-practice/ai-practice-blkoriginmedic-female-6-0-spine.atlas',
      //'outfit'   : ['female', 'blkorigingenius', 'common']
    },
    {
      'position' : 3,
      'nftId'    : "test3",
      'scale'    : 'character',
      'skin'     : 'Male',
      'weapon'   : 'blkpartnerrevelatorz17-ultrarare',
      'atlasFile' : 'nfts/ai-practice/ai-practice-blkorigingenius-male-5-0-spine.atlas',
      //'pose'     : 'ConsoleSml_BasicIdle_001',
      //'outfit'   : ['male', 'blkoriginghost', 'common']
    },*/{
      'position' : 4,
      'nftId'    : "test4",
      'scale'    : 'character',
      'skin'     : 'Female',
      'weapon'   : 'blkplasmaspear-legendary',
      'atlasFile' : 'nfts/ai-practice/ai-practice-blkorigingenius-female-4-0-spine.atlas',
      //'atlasFile' : 'spine-output/character/MediumMaleHeavySkinTest.atlas',
      //'jsonFile'  : 'spine-output/character/MediumMaleHeavySkinTest.json',
      //'outfit'   : ['female', 'blkoriginheavy', 'common']
    },
    {
      'position' : 5,
      'nftId'    : "test5",
      'scale'    : 'character',
      'skin'     : 'Male',
      'weapon'   : 'blkoriginsaltas-ultrarare',
      'atlasFile' : 'nfts/ai-practice/ai-practice-blkoriginjack-male-1-0-spine.atlas',
      //'outfit'   : ['male', 'blkoriginjack', 'common']
    }/*,
    {
      'position' : 6,
      'nftId'    : "test6",
      'scale'    : 'character',
      'skin'     : 'Female',
      'weapon'   : 'blksonicbayonet-ultrarare',
      'atlasFile' : 'nfts/ai-practice/ai-practice-blkoriginjack-female-4-0-spine.atlas',
      //'outfit'   : ['female', 'blkoriginmedic', 'common']
    },
    {
      'position' : 7,
      'nftId'    : "test7",
      'scale'    : 'character',
      'skin'     : 'Male',
      'weapon'   : 'blkspecialdeathknightblade-ultrarare',
      'atlasFile' : 'nfts/ai-practice/ai-practice-blkoriginheavy-male-5-0-spine.atlas',
      //'outfit'   : ['male', 'blkorigingenius', 'common']
    }*/];

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
            width={size.width}
            height={size.height}
            background="almond-uncontrolled-lobby-001"
            characters={characters}
            //combatApi={"http://localhost:5003"}
            combatSocket={"http://localhost:5003"}
            playback={this.state.playback}
            battleId={this.state.battleId}
            teamId={1}
            key={this.state.battleId}
            createOptions={{
              "aiTeam" : {
                "0" : {"test":"test"}/*,
                "1" : {"test":"test"},
                "2" : {"test":"test"},
                "3" : {"test":"test"}*/
              }
            }}
          />
        </div>
        {this.generateBattleIdField()}
      </div>
    );
  }
}
