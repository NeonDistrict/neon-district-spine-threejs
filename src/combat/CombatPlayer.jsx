import React, { Component } from "react";
import Api from '../api/api.js';
import Socket from '../socket/socket.js';
import { CombatScene } from "./CombatScene.jsx";
import { CombatHUD } from "../objects/CombatHUD.jsx";
import { PlayerSelections } from "../objects/PlayerSelections.jsx";

export class CombatPlayer extends CombatScene {
  constructor(props) {
    super(props);

    // Keep track of combat information
    this.combatApi     = props.combatApi;
    this.combatSocket  = props.combatSocket;
    this.battleId      = props.battleId;
    this.playback      = props.hasOwnProperty('playback') ? props.playback : true;
    this.teamId        = props.teamId;
    this.createOptions = props.createOptions;

    // API for combat calls
    if (this.combatApi) {
      this.api = new Api(this.combatApi);
    } else if (this.combatSocket) {
      this.socket = new Socket(this.combatSocket, this.battleId);
      this.socket.setGetResponse(this.getCombatResponse.bind(this));
    }

    // Keep track of the UI
    this.userInterface = null;
    this.hud = null;

    // Player Selections
    this.playerSelections = new PlayerSelections();

    // Keeping track of events that have been played,
    // current state, and events to play
    this.teams = null;

    // Keep track of events
    this.lastRenderedEventBlockUuid = null;
    this.eventBlocksIds = [];
    this.eventBlocks = [];
    this.battleComplete = false;

    // Keep track of clickable regions & ability to use them
    this.clickableRegions = {};
    this.clickLock = false;

    // Monitor changes to clickable regions
    window.addEventListener('registerClickableRegion', this.handleClickableRegion.bind(this));
    window.addEventListener('unregisterClickableRegion', this.handleRemoveClickableRegion.bind(this));
    window.addEventListener('lockClickableRegions', this.lockClickableRegions.bind(this));
    window.addEventListener('unlockClickableRegions', this.unlockClickableRegions.bind(this));
    window.addEventListener('eventBlockComplete', this.moveToNextEventBlock.bind(this));
  }

  componentDidMount() {
    super.componentDidMount(arguments);

    // Draw Game UI elements
    this.userInterface = new CombatHUD(
      this.renderer,
      this.animationController.getActiveAnimationEventObject(),
      this.getUnitPosition.bind(this)
    );
    this.hud = this.userInterface.render();

    // Update the HUD to use the player selection object
    this.userInterface.setPlayerSelectionsObject(this.playerSelections);

    // Capture & handle click events
    this.canvas.addEventListener('click', this.handleCanvasClick.bind(this));

    // Pull the initial battle state
    if (this.battleId && this.battleId !== 'practice' && this.battleId !== 'test') {
      if (this.api) {
        this.getCombatApi();
      } else if (this.socket) {
        this.getCombatSocket();
      }
    } else if (this.battleId && (this.battleId === 'practice' || this.battleId === 'test')) {
      if (this.api) {
        this.createCombatApi();
      } else if (this.socket) {
        this.createCombatSocket();
      }
    }
  }

  handleClickableRegion(e) {
    this.clickableRegions[e.detail.option] = e.detail.region;
  }

  handleRemoveClickableRegion(e) {
    if (this.clickableRegions.hasOwnProperty(e.detail.option)) {
      delete this.clickableRegions[e.detail.option];      
    }
  }

  clickableRegionsLocked() {
    return this.clickLock || this.battleComplete;
  }

  lockClickableRegions() {
    console.log("Clickable regions are locked");

    // Alert the HUD
    window.dispatchEvent(
      new CustomEvent("clickableRegionsLocked", {})
    );

    this.clickLock = true;
  }

  unlockClickableRegions(e) {
    if (e && e.detail && e.detail.event === 'BattleCompleteEvent' || this.battleComplete) {
      console.log("Battle completed, will not unlock clickable regions");
      return;
    }

    console.log("Clickable regions are unlocked");

    // Alert the HUD
    window.dispatchEvent(
      new CustomEvent("clickableRegionsUnlocked", {})
    );

    this.clickLock = false;
  }

  handleCanvasClick(e) {
    if (this.clickableRegionsLocked()) {
      return;
    }

    for (let _option in this.clickableRegions) {
      let region = this.clickableRegions[_option];
      if (
        e.layerX >= region[0] && e.layerX <= region[2] &&
        e.layerY >= region[1] && e.layerY <= region[3]
      ) {
        if (['attack','card0','card1','card2'].indexOf(_option) !== -1) {

          // Make sure that the card selected is a valid choice
          if (this.playerSelections.validateActionSelect(_option)) {
            // Set the selected option
            this.playerSelections.setAction(_option);
          }
          
        } else if (['confirm'].indexOf(_option) !== -1) {

          // Pull the action and target
          let action = this.playerSelections.getAction();
          let target = this.playerSelections.getTarget();

          // If the action or target is invalid, disallow
          if (
            action === false || target === false ||
            action === null || target === null
          ) {
            return;
          }

          // Lock the HUD
          this.lockClickableRegions();

          // Run combat
          if (this.api) {
            this.runCombatApi(action, target);
          } else if (this.socket) {
            this.runCombatSocket(action, target);
          }

        } else if (_option.indexOf('target') === 0) {

          // Make sure that the card selected is a valid choice
          if (this.playerSelections.validateTargetSelect(_option)) {
            // Set the target
            this.playerSelections.setTarget(_option);
          }

        }
      }
    }
  }

  getCombatApi() {
    if (!this.battleId) {
      console.log("No battle ID provided.")
      return;
    }

    this.api.getBattle({
        battleId: this.battleId
      },
      this.getCombatResponse.bind(this),
      this.handleErrorResponse.bind(this)
    );
  }

  createCombatApi() {
    if (!this.teamId) {
      console.log("No team ID provided.")
      return;
    }

    this.api.createBattle({
        teamId: this.teamId,
        createOptions: this.createOptions
      },
      this.getCombatResponse.bind(this),
      this.handleErrorResponse.bind(this)
    );
  }

  runCombatApi(action, target) {
    if (!this.battleId) {
      console.log("No battle ID provided.")
      return;
    }

    this.api.runBattle({
        battleId: this.battleId,
        action:action,
        target:target,
        automatic:false
      },
      this.getCombatResponse.bind(this),
      this.handleErrorResponse.bind(this)
    );
  }

  getCombatSocket() {
    if (!this.battleId) {
      console.log("No battle ID provided.")
      return;
    }

    this.socket.get(this.battleId);
  }

  createCombatSocket() {
    if (!this.teamId) {
      console.log("No team ID provided.")
      return;
    }

    this.socket.create(this.teamId, this.createOptions);
  }

  runCombatSocket(action, target) {
    if (!this.battleId) {
      console.log("No battle ID provided.")
      return;
    }

    this.socket.run(this.battleId, {action, target});
  }

  getCombatResponse(response) {
    // Verify the response is valid
    if (
      !response ||
      !response.data ||
      !response.data.hasOwnProperty('data') ||
      !response.data.hasOwnProperty('status') ||
      response.data.status !== 200
    ) {
      console.error("Could not retrieve battle information:");
      console.error(response.data);
      return;
    }

    // Pull the data out
    let data = response.data.data;

    // Handle any preparation work if needed
    if (this.battleId != data.battleId) {
      console.warn("Setting new Battle ID (" + data.battleId + ") from previous (" + this.battleId + ")");

      // Update the battle ID
      this.battleId = data.battleId;

      // May need to listen to new channel
      if (this.socket) {
        this.socket.connectToChannel(this.battleId);
      }

      // Emit event for any front-end to capture data
      window.dispatchEvent(
        new CustomEvent("getBattleInformation", {
          'detail' : {
            'battleId' : data.battleId
          }
        })
      );

      // Pass off to the controller
      if (this.playback) {
        this.updateBattleEvents(data);
      } else {
        this.setLatestBattleEvents(data);
      }
    } else {
      // Pass off to the controller
      this.playerSelections.clear();
      this.updateBattleEvents(data);
    }
  }

  handleErrorResponse(error) {
    console.error("error");
    console.error(error);
    this.playerSelections.clear();
    this.unlockClickableRegions();
  }

  updateBattleEvents(data) {
    // Set any initial information
    if (!this.teams && data.teams) {
      this.setTeams(data.teams);
    } else if (data.teams) {
      this.updateTeams(data.teams);
    }

    // Set the latest options for the player
    if (data.options && data.options.length) {
      this.playerSelections.setCards(data.options);
    }

    // Determine if we have new events to render
    let hasNewEvents = false;
    for (let _block of data.events) {
      if (this.eventBlocksIds.indexOf(_block.uuid) === -1) {
        // Add event blocks to the record
        this.eventBlocksIds.push(_block.uuid);
        this.eventBlocks.push(_block);
        hasNewEvents = true;
      }
    }

    if (hasNewEvents) {
      this.renderEventBlocks();
    } else if (!this.battleComplete) {
      this.unlockClickableRegions();
    }
  }

  setLatestBattleEvents(data) {
    // Set any initial information
    if (!this.teams && data.teams) {
      this.setTeams(data.teams);
    } else if (data.teams) {
      this.updateTeams(data.teams);
    }

    // Set the latest options for the player
    if (data.options && data.options.length) {
      this.playerSelections.setCards(data.options);
    }

    // Determine if we have new events to render
    let last_block_uuid;
    for (let _block of data.events) {
      if (this.eventBlocksIds.indexOf(_block.uuid) === -1) {
        // Add event blocks to the record
        last_block_uuid = _block.uuid;
        this.eventBlocksIds.push(_block.uuid);
        this.eventBlocks.push(_block);
      }
    }

    this.lastRenderedEventBlockUuid = last_block_uuid;
    this.renderEventBlocks();
    if (!this.battleComplete) {
      this.unlockClickableRegions();
    }
  }

  setTeams(teams) {
    this.teams = teams;
    this.userInterface.setTeams(this.teams);

    // Update all characters to include their UUIDs
    // Update all team members to link back to their character
    for (let _character of this.characters) {
      for (let _teamIdx of ["one", "two"]) {
        let _team = this.teams[_teamIdx];
        for (let _unitIdx in _team) {
          let _unit = _team[_unitIdx];
          if (_unit.metadata.nftId === _character.nftId) {
            // Set matching information
            _character.unitId = _unit.unitId;
            _unit.character = _character;

            // Pull in the head image
            this.loadHeadImage(_unit);
          }
        }
      }
    }
  }

  getNftUrlRoot(_unit) {
    let urlRoot = "https://neon-district-season-one.s3.amazonaws.com/nfts/";
    console.log(_unit);
    if (
      _unit && typeof _unit === 'object' && _unit.hasOwnProperty('character') &&
      _unit.character.hasOwnProperty('nftId') && _unit.character.nftId.indexOf('ai-practice') === 0
    ) {
      return urlRoot + "ai-practice/";
    }

    if (
      window.location.href.indexOf('https://portal.neondistrict.io') === 0 ||
      window.location.href.indexOf('https://rc.portal.neondistrict.io') === 0
    ) {
      return urlRoot + "mainnet/";
    } else {
      return urlRoot + "testnet/";
    }
  }

  loadHeadImage(_unit) {
    const urlRoot = this.getNftUrlRoot(_unit);
    let headImageSrc;

    _unit.headImg = new Image();
    _unit.headImg.crossOrigin = "Anonymous";
    _unit.headImg.onload = (function() {
      _unit.headImgLoaded = true;
    }).bind(this);
    _unit.headImg.onerror = (function() {
      // Load the default
      if (headImageSrc.indexOf('male') === -1) {
        // Get the character type
        let charType = this.getCharClassType(_unit.classTypeId);
        if (!charType) return;

        // Load the new source
        headImageSrc = urlRoot + charType + "-" + _unit.character.skin.toLowerCase() + ".png";
        console.log("onerror attempt", headImageSrc);
        _unit.headImg.src = headImageSrc;
        return;
      }

      // No luck
      console.log("onerror failure");
    }).bind(this);

    // Load the intended image
    headImageSrc = urlRoot + _unit.metadata.nftId + '-headshot.png';
    _unit.headImg.src = headImageSrc;
  }

  getCharClassType(_type) {
    switch(_type) {
      case 1: return 'demon';
      case 2: return 'doc';
      case 3: return 'genius';
      case 4: return 'ghost';
      case 5: return 'heavy';
      case 6: return 'jack';
      default: return '';
    }
  }

  updateTeams(teams) {
    for (let _teamIdx of ["one", "two"]) {
      for (let _unitIdx in this.teams[_teamIdx]) {
        let _unit = this.teams[_teamIdx][_unitIdx];

        if (teams && teams.hasOwnProperty(_teamIdx) && teams[_teamIdx].hasOwnProperty(_unitIdx)) {
          let _unitUpdate = teams[_teamIdx][_unitIdx];

          // Update all stats
          if (_unitUpdate.hasOwnProperty('ticks')) {
            _unit.ticks = _unitUpdate.ticks;
          }

          if (_unitUpdate.hasOwnProperty('lastTurnOrder')) {
            _unit.lastTurnOrder = _unitUpdate.lastTurnOrder;
          }

          if (_unitUpdate.hasOwnProperty('stats')) {
            for (let _prop in _unitUpdate.stats) {
              _unit.stats[_prop] = _unitUpdate.stats[_prop];
            }
          }

          if (_unitUpdate.hasOwnProperty('statsMax')) {
            for (let _prop in _unitUpdate.statsMax) {
              _unit.statsMax[_prop] = _unitUpdate.statsMax[_prop];
            }
          }

          if (_unitUpdate.hasOwnProperty('statusEffects')) {
            for (let _prop in _unitUpdate.statusEffects) {
              _unit.statusEffects[_prop] = _unitUpdate.statusEffects[_prop];
            }
          }
        }
      }
    }
  }

  renderEventBlocks() {
    // Get the next block
    let nextIndex = 1 + this.eventBlocksIds.indexOf(this.lastRenderedEventBlockUuid);

    // If this block is beyond the last block, then we're done
    if (nextIndex >= this.eventBlocks.length) {
      this.postAnimationCleanup();
      return;
    }

    // Pull the block, register the animation events
    let block = this.eventBlocks[nextIndex];

    // Update the teams
    if (block.teams) {
      this.updateTeams(block.teams);
    }

    // If the battle is complete, we need to know this
    this.checkBattleComplete(block);

    // Perform the animation cycle
    this.runAnimationEventCycle(block);
  }

  moveToNextEventBlock() {
    // When we're done, update the last rendered event block, and render the next block
    if ((1 + this.eventBlocksIds.indexOf(this.lastRenderedEventBlockUuid)) < this.eventBlocks.length) {
      this.lastRenderedEventBlockUuid = this.eventBlocks[1 + this.eventBlocksIds.indexOf(this.lastRenderedEventBlockUuid)].uuid;
    }

    this.renderEventBlocks();
  }

  checkBattleComplete(block) {
    if ((block.battleEvents.filter((_evt) => _evt.name === 'BattleCompleteEvent')).length > 0) {
      console.log("Battle is completed");
      this.battleComplete = true;
    }
  }

  postAnimationCleanup() {
    if (!this.battleComplete) {
      this.unlockClickableRegions();
    }
  }

}
