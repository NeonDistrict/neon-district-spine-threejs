import React from "react";
import lstyle from "../../styles/hud.scss";

import { Flex } from 'pizza-juice';

import { HUDComponent } from './core/HUDComponent.jsx';
import { PlayerControlsDefaultOptions } from './components/PlayerControlsDefaultOptions.jsx';
import { PlayerControlsCharacter } from './components/PlayerControlsCharacter.jsx';
import { PlayerControlsCard } from './components/card/PlayerControlsCard.jsx';
import { TargetCharacterControls } from './components/TargetCharacterControls.jsx';

export class PlayerControlsDisplay extends HUDComponent {

  constructor(props) {
    super(props);

    this.state = {
      selectedAction : null,
      selectedTarget : null,
      activeCharacter : null
    };

    this.confirmAction = props.confirmAction;
  }

  chooseOption(option) {
    if (this.state.selectedAction !== option) {
      if (this.props.playerSelections && this.props.playerSelections.validateActionSelect(option)) {
        this.props.playerSelections.setAction(option);
      }
      this.setState({selectedAction:option});
    }
  }

  chooseReplaceOption(target) {
    // Remove visuals
    this.setState({selectedAction:null, selectedAction:null});

    // Select replace and the correct card target
    if (this.props.playerSelections && this.props.playerSelections.validateActionSelect('replace')) {
      this.props.playerSelections.setAction('replace');

      if (this.props.playerSelections && this.props.playerSelections.validateTargetSelect(target)) {
        this.props.playerSelections.setTarget(target);

        // Submit the action
        this.confirmAction();
      }
    }
  }

  chooseTarget(option) {
    if (this.props.playerSelections && this.props.playerSelections.validateTargetSelect(option)) {
      this.props.playerSelections.setTarget(option);
      this.setState({selectedTarget: option});
    }
  }

  confirmActionCapture() {
    this.setState({selectedAction:null, selectedAction:null});
    this.confirmAction();
  }

  render() {
    console.log("** Rendering the Player Controls Display **");

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
              selected={this.state.selectedAction}
            />

            {/* Cards */}
            <div className={lstyle.cardWrapper}>
              <PlayerControlsCard
                card={this.props.playerSelections && this.props.playerSelections.getCard(0) || {}}
                callback={this.chooseOption.bind(this, 'card0')}
                replaceCallback={this.chooseReplaceOption.bind(this, 'card0')}
                selected={this.state.selectedAction === 'card0'}
              />

              <PlayerControlsCard
                card={this.props.playerSelections && this.props.playerSelections.getCard(1) || {}}
                callback={this.chooseOption.bind(this, 'card1')}
                replaceCallback={this.chooseReplaceOption.bind(this, 'card1')}
                selected={this.state.selectedAction === 'card1'}
              />

              <PlayerControlsCard
                card={this.props.playerSelections && this.props.playerSelections.getCard(2) || {}}
                callback={this.chooseOption.bind(this, 'card2')}
                replaceCallback={this.chooseReplaceOption.bind(this, 'card2')}
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
              activeAnimEvt={this.props.activeAnimEvt}
              character={targetCharacter}
              selectedAction={this.state.selectedAction}
              confirmCallback={this.confirmActionCapture.bind(this)}
            />
          </div>
        </div>
      </div>
    );
  }

}
