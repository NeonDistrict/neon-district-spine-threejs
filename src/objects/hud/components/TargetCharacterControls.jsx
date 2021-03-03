import React from "react";
import { HUDComponent } from '../core/HUDComponent.jsx';
import lstyle from "../../../styles/hud.scss";

export class TargetCharacterControls extends HUDComponent {

  render() {
    console.log("** Rendering the Target Character Controls **");

    let targetUnit = this.props.character;

    let statusEffectChanges = this.props.activeAnimEvt && this.props.activeAnimEvt.getActiveStatusEffectChanges(unit.unitId);
    let hasPoison        = (statusEffectChanges && statusEffectChanges.POISON > 0) || (targetUnit && targetUnit.statusEffects.POISON > 0);
    let hasRegenerate    = (statusEffectChanges && statusEffectChanges.REGENERATE > 0) || (targetUnit && targetUnit.statusEffects.REGENERATE > 0);
    let hasShield        = (statusEffectChanges && statusEffectChanges.SHIELD > 0) || (targetUnit && targetUnit.statusEffects.SHIELD > 0);
    let hasTaunt         = (statusEffectChanges && statusEffectChanges.TAUNT > 0) || (targetUnit && targetUnit.statusEffects.TAUNT > 0);
    let hasCounterattack = (statusEffectChanges && statusEffectChanges.COUNTERATTACK > 0) || (targetUnit && targetUnit.statusEffects.COUNTERATTACK > 0);

    return (
      <div className={lstyle.targetCharacterControls}>
        <div className={lstyle.targetCharacterStats}>
          <div className={lstyle.targetCharacterStatsHeader}>
            <div className={lstyle.statusEffects}>
              <span className={[lstyle.statusEffect, lstyle.statusEffectPoison,        hasPoison        ? lstyle.visible : ''].join(' ')}></span>
              <span className={[lstyle.statusEffect, lstyle.statusEffectRegenerate,    hasRegenerate    ? lstyle.visible : ''].join(' ')}></span>
              <span className={[lstyle.statusEffect, lstyle.statusEffectShield,        hasShield        ? lstyle.visible : ''].join(' ')}></span>
              <span className={[lstyle.statusEffect, lstyle.statusEffectTaunt,         hasTaunt         ? lstyle.visible : ''].join(' ')}></span>
              <span className={[lstyle.statusEffect, lstyle.statusEffectCounterattack, hasCounterattack ? lstyle.visible : ''].join(' ')}></span>
            </div>

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
          <button className={lstyle.confirmButton} onClick={this.props.confirmCallback} disabled={this.hudLocked}>
            Confirm
          </button>
        </div>
      </div>
    );
  }

}
