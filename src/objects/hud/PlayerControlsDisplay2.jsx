import React, { Component } from "react";
import lstyle from "../../styles/hud.scss";

import { HUDElement } from './HUDElement.jsx';
import { CardFull } from './CardFull.jsx';
import { ImageCache } from '../ImageCache.jsx';
import HUDSTYLES from "../../data/hudStyles.js";

export class PlayerControlsDisplay extends Component {

  constructor(props) {
    super(props);

    this.confirmAction = props.confirmAction;
    this.selectedAction = null;
    this.selectedTarget = null;

    this.init();
  }

  setTeams(teams) {
    this.teams = teams;
    this.init();
  }

  init() {
    this.units = [];
    if (
      !this.teams ||
      !this.teams.hasOwnProperty('one') ||
      !this.teams.hasOwnProperty('two')
    ) {
      return;
    }

    for (let _team of [this.teams.one, this.teams.two]) {
      for (let _prop in _team) {
        this.units.push(_team[_prop]);
      }
    }
  }

  getSelectedAction() {
    if (this.props.playerSelections && this.props.playerSelections.getAction) {
      return this.props.playerSelections.getAction();
    }
  }

  getSelectedTarget() {
    if (this.props.playerSelections && this.props.playerSelections.getTarget) {
      return this.props.playerSelections.getTarget();
    }
  }

  getActivePlayer() {
    return this.units.reduce((acc, curr) => {
      if (!acc) return curr;
      if (curr.stats.HEALTH <= 0) return acc;
      if (acc.ticks < curr.ticks) return acc;
      if (acc.ticks == curr.ticks) {
        if (acc.lastTurnOrder < curr.lastTurnOrder) return acc;
        return curr;
      }
      return curr;
    });
  }

  getTarget() {
    for (let _idx in this.units) {
      if (this.units[_idx].unitId === this.props.playerSelections.getTarget()) {
        return this.units[_idx];
      }
    }
  }

  chooseCard(option) {
    if (this.props.playerSelections && this.props.playerSelections.validateActionSelect(option)) {
      this.props.playerSelections.setAction(option);
    }
  }

  chooseTarget(option) {
    if (this.props.playerSelections && this.props.playerSelections.validateTargetSelect(option)) {
      this.props.playerSelections.setTarget(option);
    }
  }

  render() {
    let targets = [];
    if (this.props && this.props.teams) {
      for (let teamKey in this.props.teams) {
        for (let unitKey in this.props.teams[teamKey]) {
          let unit = this.props.teams[teamKey][unitKey];
          targets.push(
            <div>
              <a onClick={this.chooseTarget.bind(this, 'target-' + unit.unitId)}>{unit.metadata.nftId}</a>
            </div>
          );
        }
      }
    }

    return (
      <div className={lstyle.playerControlsWrapper}>
        <div className={lstyle.playerRegion}>
          <div className={lstyle.topBorder}>
            Player
          </div>

          <div className={lstyle.topBorder}>
            <a onClick={this.chooseCard.bind(this, 'attack')}>Attack</a><br />
            <a onClick={this.chooseCard.bind(this, 'card0')}>Card 0</a><br />
            <a onClick={this.chooseCard.bind(this, 'card1')}>Card 1</a><br />
            <a onClick={this.chooseCard.bind(this, 'card2')}>Card 2</a>
          </div>
        </div>
        <div className={lstyle.targetRegion}>
          <div className={lstyle.topBorder}>
            Target
          </div>

          <div className={lstyle.topBorder}>
            {targets}
            <a onClick={this.confirmAction.bind(this)}>Confirm</a>
          </div>
        </div>
      </div>
    );
  }

}
