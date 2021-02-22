import React, { Component } from "react";
import lstyle from "../../../styles/hud.scss";

export class TargetCharacterControls extends Component {

  render() {
    console.log("** Rendering the Target Character Controls **");

    let targetUnit = this.props.character;

    return (
      <div className={lstyle.targetCharacterControls}>
        <div className={lstyle.targetCharacterStats}>
          <div className={lstyle.targetCharacterStatsHeader}>
            Stats
          </div>
          <div className={lstyle.targetCharacterStatsBody}>
            <div className={lstyle.attribute}>
              <div className={lstyle.attributeValue}>{targetUnit && targetUnit.stats && Math.ceil(targetUnit.stats.HEALTH) || 0}</div>
              <div className={lstyle.attributeName}>Health</div>
            </div>

            <div className={lstyle.attribute}>
              <div className={lstyle.attributeValue}>{targetUnit && targetUnit.stats && Math.ceil(targetUnit.stats.ATTACK) || 0}</div>
              <div className={lstyle.attributeName}>Attack</div>
            </div>

            <div className={lstyle.attribute}>
              <div className={lstyle.attributeValue}>{targetUnit && targetUnit.stats && Math.ceil(targetUnit.stats.DEFENSE) || 0}</div>
              <div className={lstyle.attributeName}>Defense</div>
            </div>

            <div className={lstyle.attribute}>
              <div className={lstyle.attributeValue}>{targetUnit && targetUnit.stats && Math.ceil(targetUnit.stats.NANO) || 0}</div>
              <div className={lstyle.attributeName}>Nano</div>
            </div>

            <div className={lstyle.attribute}>
              <div className={lstyle.attributeValue}>{targetUnit && targetUnit.stats && Math.ceil(targetUnit.stats.STEALTH) || 0}</div>
              <div className={lstyle.attributeName}>Stealth</div>
            </div>

            <div className={lstyle.attribute}>
              <div className={lstyle.attributeValue}>{targetUnit && targetUnit.stats && Math.ceil(targetUnit.stats.MECH) || 0}</div>
              <div className={lstyle.attributeName}>Mech</div>
            </div>

            <div className={lstyle.attribute}>
              <div className={lstyle.attributeValue}>{targetUnit && targetUnit.stats && Math.ceil(targetUnit.stats.TACTICS) || 0}</div>
              <div className={lstyle.attributeName}>Tactics</div>
            </div>

            <div className={lstyle.attribute}>
              <div className={lstyle.attributeValue}>{targetUnit && targetUnit.stats && Math.ceil(targetUnit.stats.HACKING) || 0}</div>
              <div className={lstyle.attributeName}>Hacking</div>
            </div>
          </div>
        </div>

        <div className={lstyle.targetButtons}>
          <button className={lstyle.confirmButton} onClick={this.props.confirmCallback}>
            Confirm
          </button>
        </div>
      </div>
    );
  }

}
