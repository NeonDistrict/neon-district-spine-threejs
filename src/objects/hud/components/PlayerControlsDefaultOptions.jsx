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
            {/* Ticks */}
            <span className={lstyle.cardTicks}>
              <span className={lstyle.cardTicksNumber}>40</span>
              <hr className={[lstyle.cardTicksLine, lstyle.attackCard].join(' ')} />
              <span className={lstyle.cardTicksLabel}>Ticks</span>
            </span>

            {/* Central Image */}
            <img className={lstyle.baseAttackImg} src="https://neon-district-season-one.s3.amazonaws.com/assets/V5/64w/1x/Attack.png" />

            {/* Header */}
            <h3 className={lstyle.baseAttackTitle}>Base Attack</h3>
          </div>
        </div>
      </div>
    );
  }

}
