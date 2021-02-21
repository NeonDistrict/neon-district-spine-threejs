import React, { Component } from "react";
import lstyle from "../../styles/hud.scss";
import { PlayerControlsDefaultOptions } from './components/PlayerControlsDefaultOptions.jsx';
import { PlayerControlsCharacter } from './components/PlayerControlsCharacter.jsx';
import { PlayerControlsCard } from './components/PlayerControlsCard.jsx';
import { TargetCharacterControls } from './components/TargetCharacterControls.jsx';

export class PlayerControlsDisplay extends Component {

  constructor(props) {
    super(props);

    this.state = {
      selectedAction : null,
      selectedTarget : null,
      activeCharacter : null
    };

    this.confirmAction = props.confirmAction;

    this.init();
  }

  setTeams(teams) {
    this.teams = teams;
    this.init();
  }

  init() {
    this.units = [];
    if (
      !this.props.teams ||
      !this.props.teams.hasOwnProperty('one') ||
      !this.props.teams.hasOwnProperty('two')
    ) {
      return;
    }

    for (let _team of [this.props.teams.one, this.props.teams.two]) {
      for (let _prop in _team) {
        this.units.push(_team[_prop]);
      }
    }
  }

  getActivePlayer() {
    if (this.units.length === 0) {
      return {};
    }

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

  chooseOption(option) {
    if (this.state.selectedAction !== option) {
      if (this.props.playerSelections && this.props.playerSelections.validateActionSelect(option)) {
        this.props.playerSelections.setAction(option);
      }

      this.setState({selectedAction:option});
    }
  }

  chooseTarget(option) {
    if (this.props.playerSelections && this.props.playerSelections.validateTargetSelect(option)) {
      this.props.playerSelections.setTarget(option);
      this.setState({selectedTarget: option});
    }
  }

  render() {
    console.log("** Rendering the Player Controls Display **");

    let targets = [];
    if (this.props && this.props.teams) {
      for (let teamKey in this.props.teams) {
        for (let unitKey in this.props.teams[teamKey]) {
          let unit = this.props.teams[teamKey][unitKey];
          targets.push(
            <span>
              <a onClick={this.chooseTarget.bind(this, 'target-' + unit.unitId)}>{unit.metadata.nftId}</a>
            </span>
          );
        }
      }
    }

    let activeCharacter = this.getActivePlayer();
    let targetCharacter = this.getTarget();

    return (
      <div className={lstyle.playerControlsWrapper}>
        <div className={[lstyle.playerRegion, lstyle.bottomBorder].join(' ')}>

          {/* Top Border */}
          <div className={lstyle.topBorder}>
            Player
          </div>

          {/* Middle Panel */}
          <div className={lstyle.playerControls}>

            {/* Player Profile */}
            <PlayerControlsCharacter
              character={activeCharacter}
              isTarget={false}
            />

            {/* Attack, and eventually, Interact */}
            <PlayerControlsDefaultOptions
              callback={this.chooseOption.bind(this, 'attack')}
              selectedAction={this.state.selectedAction}
            />

            {/* Cards */}
            <div className={lstyle.cardWrapper}>
              <PlayerControlsCard
                card={this.props.playerSelections && this.props.playerSelections.getCard(0) || {}}
                callback={this.chooseOption.bind(this, 'card0')}
                selected={this.state.selectedAction === 'card0'}
              />

              <PlayerControlsCard
                card={this.props.playerSelections && this.props.playerSelections.getCard(1) || {}}
                callback={this.chooseOption.bind(this, 'card1')}
                selected={this.state.selectedAction === 'card1'}
              />

              <PlayerControlsCard
                card={this.props.playerSelections && this.props.playerSelections.getCard(2) || {}}
                callback={this.chooseOption.bind(this, 'card2')}
                selected={this.state.selectedAction === 'card2'}
              />
            </div>

          </div>

        </div>
        <div className={[lstyle.targetRegion, lstyle.bottomBorder].join(' ')}>

          {/* Top Border */}
          <div className={lstyle.topBorder}>
            Target
          </div>

          {/* Middle Panel */}
          <div className={lstyle.targetControls}>
            {/* Player Profile */}
            <PlayerControlsCharacter
              character={targetCharacter}
              isTarget={true}
            />

            <TargetCharacterControls
              character={targetCharacter}
              selectedAction={this.state.selectedAction}
              confirmCallback={this.confirmAction.bind(this)}
            />

            {/*targets*/}
          </div>
        </div>
      </div>
    );
  }

}
