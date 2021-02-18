import React, { Component } from "react";
import ReactDOM from "react-dom";

import { TurnOrderDisplay } from "./hud/TurnOrderDisplay.jsx";
import { PlayerControlsDisplay } from "./hud/PlayerControlsDisplay2.jsx";
import { UnitStatusDisplay } from "./hud/UnitStatusDisplay.jsx";
import { VersionDisplay } from "./hud/VersionDisplay2.jsx";
import { ErrorDisplay } from "./hud/ErrorDisplay.jsx";
import { ScreenCanvasOverlay } from "./hud/ScreenCanvasOverlay.jsx";

export class CombatHUD {
  constructor(renderer, activeAnimEvt, getUnitPosition, confirmAction) {
    this.renderer = renderer;
    this.parentCanvas = this.renderer.domElement;
    this.activeAnimEvt = activeAnimEvt;
    this.getUnitPosition = getUnitPosition;
    this.confirmAction = confirmAction;

    // Create the HUD canvas
    this.div = document.createElement('div');
    this.div.width = this.parentCanvas.width;
    this.div.height = this.parentCanvas.height;

    // Set up the DIV
    this.parentCanvas.parentNode.appendChild(this.div);
    this.div.style.width = this.parentCanvas.style.width;
    this.div.style.height = this.parentCanvas.style.height;
    this.parentCanvas.parentNode.position = "relative";
    this.parentCanvas.style.position = "absolute";
    this.div.style.position = "absolute";

    // Needs update
    this.needsUpdate = true;
  }

  setTeams(teams) {
    this.teams = teams;
    this.needsUpdate = true;
    //this.playerControlsDisplay.setTeams(teams);
    //this.turnOrderDisplay.setTeams(teams);
    //this.unitStatusDisplay.setTeams(teams);
  }

  setPlayerSelectionsObject(playerSelections) {
    this.playerSelections = playerSelections;
    this.needsUpdate = true;
    //this.playerControlsDisplay.setPlayerSelectionsObject(playerSelections);
  }

  setError(err) {
    //this.errorDisplay.setError(err);
  }

  invalidate() {
    this.needsUpdate = true;
    //this.playerControlsDisplay.needsUpdate = true;
    //this.turnOrderDisplay.needsUpdate = true;
    //this.unitStatusDisplay.needsUpdate = true;
  }

  update(delta) {
    //if (this.errorDisplay.preUpdate(delta)) {needsUpdate=true;}
    //if (this.turnOrderDisplay.preUpdate(delta)) {needsUpdate=true;}
    //if (this.playerControlsDisplay.preUpdate(delta)) {needsUpdate=true;}
    //if (this.unitStatusDisplay.preUpdate(delta)) {needsUpdate=true;}
    //if (this.screenCanvasOverlay.preUpdate(delta)) {needsUpdate=true;}

    if (!this.needsUpdate) {
      return;
    }

    this.needsUpdate = false;

    ReactDOM.render(
      (
        <div>
          <VersionDisplay />
          <PlayerControlsDisplay confirmAction={this.confirmAction} teams={this.teams} playerSelections={this.playerSelections} />
        </div>
      ),
      this.div
    );
  }


}
