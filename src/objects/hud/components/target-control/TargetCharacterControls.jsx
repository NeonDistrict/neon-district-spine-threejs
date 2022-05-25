import React from "react";
import { HUDComponent } from "../../core/HUDComponent.jsx";
import { Character } from "../character/index.jsx";

import { Box, Flex, Grid, Button } from "pizza-juice";
import { Stat } from "./Stat.jsx";

export class TargetCharacterControls extends HUDComponent {
  render() {
    console.log("** Rendering the Target Character Controls **");

    const stats = this.props.character && this.props.character.stats;

    // TODO: Status effects
    // let statusEffectChanges = this.props.activeAnimEvt && this.props.activeAnimEvt.getActiveStatusEffectChanges(unit.unitId);
    // let hasPoison        = (statusEffectChanges && statusEffectChanges.POISON > 0) || (targetUnit && targetUnit.statusEffects.POISON > 0);
    // let hasRegenerate    = (statusEffectChanges && statusEffectChanges.REGENERATE > 0) || (targetUnit && targetUnit.statusEffects.REGENERATE > 0);
    // let hasShield        = (statusEffectChanges && statusEffectChanges.SHIELD > 0) || (targetUnit && targetUnit.statusEffects.SHIELD > 0);
    // let hasTaunt         = (statusEffectChanges && statusEffectChanges.TAUNT > 0) || (targetUnit && targetUnit.statusEffects.TAUNT > 0);
    // let hasCounterattack = (statusEffectChanges && statusEffectChanges.COUNTERATTACK > 0) || (targetUnit && targetUnit.statusEffects.COUNTERATTACK > 0);

    return (
      <Flex gap={2}>
        <Box
          css={{
            bg:
              "linear-gradient(180deg, rgba(0, 0, 0, 0.4) 53.85%, rgba(0, 0, 0, 0) 100%)"
          }}
        >
          <Character character={this.props.targetCharacter} enemy />
        </Box>

        <Flex direction="column" justify="between" css={{ flex: 1 }}>
          <Grid columns={2} gapX={4} gapY={1}>
            {/* FIXME: add .? later */}
            <Stat label="HP" value={(stats && stats.HEALTH) || 0} />
            <Stat label="STL" value={(stats && stats.STEALTH) || 0} />
            <Stat label="ATK" value={(stats && stats.ATTACK) || 0} />
            <Stat label="MEC" value={(stats && stats.MECH) || 0} />
            <Stat label="DEF" value={(stats && stats.DEFENSE) || 0} />
            <Stat label="TAC" value={(stats && stats.TACTICS) || 0} />
            <Stat label="NAN" value={(stats && stats.NANO) || 0} />
            <Stat label="HAC " value={(stats && stats.HACKING) || 0} />
          </Grid>

          <Button
            onClick={this.props.confirmCallback}
            disabled={this.hudLocked}
          >
            Confirm
          </Button>
        </Flex>
      </Flex>
    );
  }
}
