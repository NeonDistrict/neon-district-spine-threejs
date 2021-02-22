import React, { Component } from "react";
import lstyle from "../../../styles/hud.scss";

export class PlayerControlsCharacter extends Component {

  render() {
    console.log("** Rendering the Player Controls Character **");

    let imgClasses = [
      this.props.isTarget ? lstyle.targetProfile : lstyle.playerProfile,
      this.props.character && this.props.character.team == 'two' ? lstyle.flipHorizontal : ''
    ].join(' ');

    return (
      <div className={lstyle.activeCharacter}>
        <div className={lstyle.characterProfile}>
          <img
            src={this.props.character && this.props.character.headImgSrc}
            className={imgClasses}
          />

          <div className={lstyle.characterName}>
            {this.props.character && this.props.character.metadata && this.props.character.metadata.name || "Select Your Target"}
          </div>
        </div>
      </div>
    );
  }

}
