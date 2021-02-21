import React, { Component } from "react";
import ReactDOM from "react-dom";

import { PlayerControlsDisplay } from "./hud/PlayerControlsDisplay.jsx";
import { VersionDisplay } from "./hud/VersionDisplay.jsx";
import { UnitSelectionFields } from "./hud/UnitSelectionFields.jsx";

//import { TurnOrderDisplay } from "./hud/TurnOrderDisplay.jsx";
//import { UnitStatusDisplay } from "./hud/UnitStatusDisplay.jsx";
//import { ErrorDisplay } from "./hud/ErrorDisplay.jsx";
//import { ScreenCanvasOverlay } from "./hud/ScreenCanvasOverlay.jsx";

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
    this.div.style.pointerEvents = "none"; // prevent capturing mouse clicks

    // Set up the unit target regions
    this.unitSelectionFields = new UnitSelectionFields({
      getUnitPosition: this.getUnitPosition
    });

    // Needs update
    this.needsUpdate = true;
  }

  setTeams(teams) {
    this.teams = teams;
    this.needsUpdate = true;
    this.unitSelectionFields.setTeams(teams);
  }

  registerTargetRegions() {
    this.unitSelectionFields.registerTargetRegions();
  }

  setPlayerSelectionsObject(playerSelections) {
    this.playerSelections = playerSelections;
    this.needsUpdate = true;
  }

  setError(err) {
    this.error = err;
    this.needsUpdate = true;
  }

  invalidate() {
    this.needsUpdate = true;
  }

  update(delta) {
    if (!this.needsUpdate) {
      return;
    }
    this.needsUpdate = false;

    console.log("** Rendering the Entire HUD **");

    ReactDOM.render(
      (
        <div>
          <VersionDisplay />
          <PlayerControlsDisplay
            confirmAction={this.confirmAction}
            teams={this.teams}
            playerSelections={this.playerSelections}
          />
        </div>
      ),
      this.div
    );
  }


}
