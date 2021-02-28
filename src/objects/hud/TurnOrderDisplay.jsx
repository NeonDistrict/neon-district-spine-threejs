import React, { Component } from "react";
import lstyle from "../../styles/hud.scss";

export class TurnOrderDisplay extends Component {

  constructPortraitOrder() {
    if (!this.units || this.units.length === 0) {
      if (
        !this.props.teams ||
        !this.props.teams.hasOwnProperty('one') ||
        !this.props.teams.hasOwnProperty('two')
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
      portraits.push(
        <div className={lstyle.unitTurnOrderPortrait}>
          <div className={lstyle.unitTurnOrderTicks}>
            {this.units[idx].ticks}
          </div>
          <div className={lstyle.unitTurnOrderPortraitImage} style={{backgroundImage: `url(${this.units[idx].headImgSrc})`}}></div>
        </div>
      );
    }

    /**
    
    **/

    return (
      <div className={lstyle.turnOrderDisplay} style={{left: `calc(50% - ${40*this.units.length}px)`}}>
        {portraits}
      </div>
    );

  }

}
