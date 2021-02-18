import React, { Component } from "react";
import ReactDOM from "react-dom";

import { VersionDisplay2 } from "./hud/VersionDisplay2.jsx";

export class HUD extends Component {
  constructor(renderer, activeAnimEvt, getUnitPosition) {
    this.renderer = renderer;
    this.parentCanvas = this.renderer.domElement;
    this.activeAnimEvt = activeAnimEvt;
    this.getUnitPosition = getUnitPosition;

    // Create the HUD canvas
    this.div = document.createElement('div');
    this.div.width = this.parentCanvas.width;
    this.div.height = this.parentCanvas.height;

    // add a canvas element over the WebGl canvas element
    this.parentCanvas.parentNode.appendChild(this.div);
    this.div.style.width = this.parentCanvas.style.width;
    this.div.style.height = this.parentCanvas.style.height;
    this.parentCanvas.parentNode.position = "relative";
    this.parentCanvas.style.position = "absolute";
    this.div.style.position = "absolute";

    // Keep track of any other important values
    this.width = this.div.width;
    this.height = this.div.height;

    this.versionDisplay = new VersionDisplay2({
      'div' : this.div,
      'x' : 0,
      'y' : 0
    });

    /*
    // Regions of the HUD
    this.turnOrderDisplay = new TurnOrderDisplay({
      'context'       : this.context,
      'x'             : this.width / 2,
      'y'             : 0,
      'width'         : this.width,
      'height'        : this.height,
      'activeAnimEvt' : this.activeAnimEvt
    });

    this.playerControlsDisplay = new PlayerControlsDisplay({
      'context'       : this.context,
      'x'             : this.width / 2,
      'y'             : this.height,
      'width'         : this.width,
      'height'        : this.height,
      'activeAnimEvt' : this.activeAnimEvt
    });

    this.unitStatusDisplay = new UnitStatusDisplay({
      'context'         : this.context,
      'x'               : this.width / 2,
      'y'               : 0,
      'width'           : this.width,
      'height'          : this.height,
      'activeAnimEvt'   : this.activeAnimEvt,
      'getUnitPosition' : this.getUnitPosition
    });

    this.versionDisplay = new VersionDisplay({
      'context' : this.context,
      'x'       : 0,
      'y'       : 0
    });

    this.screenCanvasOverlay = new ScreenCanvasOverlay({
      'context' : this.context,
      'x'       : 0,
      'y'       : 0,
      'width'   : this.width,
      'height'  : this.height
    });

    this.errorDisplay = new ErrorDisplay({
      'context' : this.context,
      'x'       : this.width - 400,
      'y'       : this.height / 2 + 200,
      'width'   : 400,
      'height'  : 150,
    });
    */
  }

  setTeams(teams) {
    this.teams = teams;
    //this.playerControlsDisplay.setTeams(teams);
    //this.turnOrderDisplay.setTeams(teams);
    //this.unitStatusDisplay.setTeams(teams);
  }

  invalidate() {
    //this.playerControlsDisplay.needsUpdate = true;
    //this.turnOrderDisplay.needsUpdate = true;
    //this.unitStatusDisplay.needsUpdate = true;
  }

  setPlayerSelectionsObject(playerSelections) {
    this.playerSelections = playerSelections;
    //this.playerControlsDisplay.setPlayerSelectionsObject(playerSelections);
  }

  setError(err) {
    //this.errorDisplay.setError(err);
  }

  update(delta) {
    let needsUpdate = false;

    //if (this.errorDisplay.preUpdate(delta)) {needsUpdate=true;}
    //if (this.turnOrderDisplay.preUpdate(delta)) {needsUpdate=true;}
    //if (this.playerControlsDisplay.preUpdate(delta)) {needsUpdate=true;}
    //if (this.unitStatusDisplay.preUpdate(delta)) {needsUpdate=true;}
    //if (this.screenCanvasOverlay.preUpdate(delta)) {needsUpdate=true;}
//
    //if (needsUpdate) {
    this.versionDisplay.update(delta);
    //  this.errorDisplay.update(delta);
    //  this.unitStatusDisplay.update(delta);
    //  this.playerControlsDisplay.update(delta);
    //  this.turnOrderDisplay.update(delta);
    //  this.screenCanvasOverlay.update(delta);
    //}
  }


}
