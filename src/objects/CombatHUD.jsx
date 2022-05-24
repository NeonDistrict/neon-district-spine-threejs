import React, { Component } from "react";
import ReactDOM from "react-dom";

import { PlayerControlsDisplay } from "./hud/PlayerControlsDisplay.jsx";
import { VersionDisplay } from "./hud/VersionDisplay.jsx";
import { SettingsDisplay } from "./hud/SettingsDisplay.jsx";
import { PlayerTargetMap } from "./hud/PlayerTargetMap.jsx";
import { CharacterStatuses } from "./hud/CharacterStatuses.jsx";
import { TurnOrderDisplay } from "./hud/TurnOrderDisplay.jsx";
import { ErrorDisplay } from "./hud/ErrorDisplay.jsx";

import { UnitSelectionFields } from "./UnitSelectionFields.jsx";

import { Box, globalCss } from 'pizza-juice'

//import { UnitStatusDisplay } from "./hud/UnitStatusDisplay.jsx";
//import { ScreenCanvasOverlay } from "./hud/ScreenCanvasOverlay.jsx";

export class CombatHUD {
  constructor(renderer, soundManager, activeAnimEvt, getUnitPosition, confirmAction) {
    this.renderer = renderer;
    this.soundManager = soundManager;
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

    // Set up the unit target regions
    this.unitSelectionFields = new UnitSelectionFields({
      getUnitPosition: this.getUnitPosition
    });
    this.target = null;

    // Teams & units
    this.teams = null;
    this.units = null;
    this.currentEventIndexCached = null;

    window.addEventListener('clickableRegionsLocked', () => { this.needsUpdate = true; });
    window.addEventListener('clickableRegionsUnlocked', () => { this.needsUpdate = true; });

    // Needs update
    this.needsUpdate = true;
  }

  setTeams(teams) {
    this.teams = teams;
    this.translateTeamsToUnits(teams);
    this.needsUpdate = true;
    this.unitSelectionFields.setTeams(teams);
  }

  translateTeamsToUnits(teams) {
    if (!this.units || this.units.length === 0) {
      if (
        !teams ||
        !teams.hasOwnProperty('one') ||
        !teams.hasOwnProperty('two')
      ) {
        return;
      }

      this.units = [];
      for (let _team of [teams.one, teams.two]) {
        for (let _prop in _team) {
          this.units.push(_team[_prop]);
        }
      }
    }
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
    if (this.playerSelections.getTarget() !== this.target) {
      this.target = this.playerSelections.getTarget();
      this.needsUpdate = true;
    }

    if (this.activeAnimEvt.getCurrentEventIndex() !== this.currentEventIndexCached) {
      this.currentEventIndexCached = this.activeAnimEvt.getCurrentEventIndex();
      this.needsUpdate = true;
    }

    if (!this.needsUpdate) {
      return;
    }
    this.needsUpdate = false;

    console.log("** Rendering the Entire HUD **");

    const cssReset = globalCss({
      "*, *:before, *:after": {
        boxSizing: "border-box",
      },
    });
    cssReset();
    
    ReactDOM.render(
      (
        <Box css={{
          font: "7.5px 'Titillium Web', sans-serif",
          textTransform: "uppercase",
          margin: 0,
        }}>
          <VersionDisplay />
          <SettingsDisplay
            soundManager={this.soundManager}
          />
          <PlayerTargetMap
            unitSelectionFields={this.unitSelectionFields}
            playerSelections={this.playerSelections}
          />
          <CharacterStatuses
            unitSelectionFields={this.unitSelectionFields}
            playerSelections={this.playerSelections}
            activeAnimEvt={this.activeAnimEvt}
          />
          <PlayerControlsDisplay
            confirmAction={this.confirmAction}
            teams={this.teams}
            units={this.units}
            playerSelections={this.playerSelections}
          />
          <TurnOrderDisplay
            teams={this.teams}
            units={this.units}
          />
          <ErrorDisplay
            error={this.error}
          />
        </Box>
      ),
      this.div
    );
  }


}
