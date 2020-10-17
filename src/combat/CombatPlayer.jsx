import React, { Component } from "react";
import Api from '../api/api.js';
import { CombatScene } from "./CombatScene.jsx";

export class CombatPlayer extends CombatScene {
  constructor(props) {
    super(props);

    // Keep track of combat information
    this.combatApi  = props.combatApi;
    this.battleId   = props.battleId;

    // API for combat calls
    this.api = new Api(this.combatApi);

    // Keeping track of events that have been played,
    // current state, and events to play
    this.teams = null;

    // Keep track of events
    this.lastRenderedEventBlockUuid = null;
    this.eventBlocksIds = [];
    this.eventBlocks = [];

    // Keep track of clickable regions
    this.clickableRegions = {};

    // Monitor changes to clickable regions
    window.addEventListener('registerClickableRegion', this.handleClickableRegion.bind(this));
    window.addEventListener('unregisterClickableRegion', this.handleRemoveClickableRegion.bind(this));
  }

  componentDidMount() {
    super.componentDidMount(arguments);

    // Capture & handle click events
    this.canvas.addEventListener('click', this.handleCanvasClick.bind(this));

    // Pull the initial battle state
    if (this.battleId) {
      this.getCombat();
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

  handleCanvasClick(e) {
    for (let _option in this.clickableRegions) {
      let region = this.clickableRegions[_option];
      if (
        e.layerX >= region[0] && e.layerX <= region[2] &&
        e.layerY >= region[1] && e.layerY <= region[3]
      ) {
        if (['attack','card0','card1','card2'].indexOf(_option) !== -1) {
          let action = _option;
          let target = 0;
          this.runCombat(action, target);
        }
      }
    }
  }

  getCombat() {
    if (!this.battleId) {
      console.log("No battle ID provided.")
      return;
    }

    this.api.getBattle({
      battleId: this.battleId
    }, (response) => {
      // Verify the response is valid
      if (
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

      // Update the battle ID
      this.battleId = data.battleId;

      // Emit event for any front-end to capture data
      window.dispatchEvent(
        new CustomEvent("getBattleInformation", {
          'detail' : {
            'battleId' : data.battleId
          }
        })
      );

      // Pass off to the controller
      this.updateBattleEvents(data);
    }, (error) => {
      console.error("error");
      console.error(error);
    });
  }

  runCombat(action, target) {
    if (!this.battleId) {
      console.log("No battle ID provided.")
      return;
    }

    this.api.runBattle({
      battleId: this.battleId,
      action:action,
      target:target,
      automatic:false
    }, (response) => {
      // Verify the response is valid
      if (
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

      // Pass off to the controller
      this.updateBattleEvents(data);
    }, (error) => {
      console.error("error");
      console.error(error);
    });
  }

  updateBattleEvents(data) {
    // Set any initial information
    if (!this.teams && data.teams) {
      this.setTeams(data.teams);
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
    }
  }

  setTeams(teams) {
    this.teams = teams;
    this.userInterface.setTeams(this.teams);
  }

  renderEventBlocks() {
    // Get the next block
    let nextIndex = 1 + this.eventBlocksIds.indexOf(this.lastRenderedEventBlockUuid);

    // If this block is beyond the last block, then we're done
    if (nextIndex >= this.eventBlocks.length) {
      return;
    }

    // Pull the block, register the animation events
    let block = this.eventBlocks[nextIndex];

    console.log("rendering", block.uuid, "at", block.atTicks);

    // When we're done, update the last rendered event block, and render the next block
    this.lastRenderedEventBlockUuid = block.uuid;
    this.renderEventBlocks();
  }

}
