import React from "react";
import { HUDComponent } from "./core/HUDComponent.jsx";
import lstyle from "../../styles/hud.scss";

import { Box, Flex } from "pizza-juice";
import { CharacterPortrait } from "./components/character-portrait/index.jsx";

export class TurnOrderDisplay extends HUDComponent {
  constructPortraitOrder() {
    if (!this.units || this.units.length === 0) {
      if (
        !this.props.teams ||
        !this.props.teams.hasOwnProperty("one") ||
        !this.props.teams.hasOwnProperty("two")
      ) {
        return;
      }

      this.units = [];
      for (let _team of [this.props.teams.one, this.props.teams.two]) {
        for (let _prop in _team) {
          this.units.push(_team[_prop]);
        }
      }
    }

    this.units.sort((_a, _b) => {
      if (_a.stats.HEALTH <= 0 && _b.stats.HEALTH <= 0) {
        if (_a.lastTurnOrder < _b.lastTurnOrder) {
          return -1;
        }
        return 1;
      } else if (_a.stats.HEALTH <= 0) {
        return 1;
      } else if (_b.stats.HEALTH <= 0) {
        return -1;
      }

      if (_a.ticks < _b.ticks) {
        return -1;
      } else if (_b.ticks < _a.ticks) {
        return 1;
      } else {
        if (_a.lastTurnOrder < _b.lastTurnOrder) {
          return -1;
        } else {
          return 1;
        }
      }
    });
  }

  render() {
    this.constructPortraitOrder();

    if (!this.units || this.units.length === 0) {
      return "";
    }

    let portraits = [];
    for (let idx = 0; idx < this.units.length; idx++) {
      if (this.units[idx].state !== "AWAKE") {
        portraits.push(
          <Box
            css={{
              position: "relative",
              top: 0,
              width: 80,
              height: 80
            }}
          >
            <CharacterPortrait
              character={this.units[idx]}
              enemy={this.units[idx].team === "two"}
            />
          </Box>
        );
      } else {
        portraits.push(
          <Box
            css={{
              position: "relative",
              top: 0,
              width: 80,
              height: 80
            }}
          >
            <CharacterPortrait
              character={this.units[idx]}
              enemy={this.units[idx].team === "two"}
            />
          </Box>
        );
      }
    }

    /**

    **/

    return (
      <Flex
        gap={4}
        css={{
          position: "absolute",
          top: 0,
          left: `calc(50% - ${40 * this.units.length}px)`
        }}
      >
        {portraits}
      </Flex>
    );
  }
}
