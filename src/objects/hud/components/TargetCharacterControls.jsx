import React, { Component } from "react";
import lstyle from "../../../styles/hud.scss";

export class TargetCharacterControls extends Component {

  render() {
    console.log("** Rendering the Target Character Controls **");

    return (
      <div className={lstyle.targetCharacterControls}>
        <div className={lstyle.targetCharacterStats}>
          Test
        </div>

        <div className={lstyle.targetButtons}>
          <a onClick={this.props.confirmCallback}>Confirm</a>
        </div>
      </div>
    );
  }

}
