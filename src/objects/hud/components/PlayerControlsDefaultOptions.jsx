import React, { Component } from "react";
import lstyle from "../../../styles/hud.scss";

export class PlayerControlsDefaultOptions extends Component {

  render() {
    console.log("** Rendering the Player Controls Default Options **");

    let styles = [lstyle.card, lstyle.baseAttack].join(' ');
    let wrapperStyle = [lstyle.cardSelectionWrapper, this.props.selectedAction === 'attack' ? lstyle.selected : ''].join(' ');

    return (
      <div className={lstyle.defaultSelections}>
        <div className={wrapperStyle}>
          <div className={styles} onClick={this.props.callback}>
            <h3>Base Attack</h3>
          </div>
        </div>
      </div>
    );
  }

}
