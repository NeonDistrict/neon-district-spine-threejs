import React, { Component } from "react";
import lstyle from "../../../styles/hud.scss";

export class PlayerControlsCharacter extends Component {

  render() {
    console.log("** Rendering the Player Controls Character **");

    return (
      <div className={lstyle.activeCharacter}>
        <div className={[lstyle.characterProfile, this.props.isTarget ? lstyle.targetProfile : lstyle.playerProfile].join(' ')}>
          <img
            src={this.props.character && this.props.character.headImgSrc}
            className={this.props.character && this.props.character.team == 'two' ? lstyle.flipHorizontal : ''}
          />

          <div className={lstyle.characterName}>
            {this.props.character && this.props.character.metadata && this.props.character.metadata.name}&nbsp;
          </div>
        </div>
      </div>
    );
  }

}
