import React from "react";
import { HUDComponent } from "./core/HUDComponent.jsx";
import lstyle from "../../styles/hud.scss";
import { StatusCard } from "./components/status-cards/index.jsx";

import { Box } from "pizza-juice";

const HEALTH_BAR_WIDTH = 64;
const TICKS_RADIUS = 12;
const TICKS_STROKE_WIDTH = 3;

export class CharacterStatuses extends HUDComponent {
  getHealthPosition(unit) {
    let health = unit.stats.HEALTH;

    if (
      this.props.activeAnimEvt &&
      this.props.activeAnimEvt.activeStatChange(unit.unitId, "HEALTH") !== false
    ) {
      let healthStatChange = this.props.activeAnimEvt.activeStatChange(
        unit.unitId,
        "HEALTH"
      );
      let animDelta = this.props.activeAnimEvt.currentTimeDelta();

      health = healthStatChange.end;

      //(
      //healthStatChange.start + healthStatChange.delta //* Math.max(Math.min(1.0 - animDelta * 2.0, 1.0), 0.0)
      //);

      // Update this unit's health
      unit.stats.HEALTH = health;
    }

    return Math.max(Math.min(health / unit.statsMax.HEALTH, 1.0), 0.0);
  }

  polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    let angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians)
    };
  }

  describeArc(x, y, radius, startAngle, endAngle) {
    let start = this.polarToCartesian(x, y, radius, endAngle);
    let end = this.polarToCartesian(x, y, radius, startAngle);

    let largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    let d = [
      "M",
      start.x,
      start.y,
      "A",
      radius,
      radius,
      0,
      largeArcFlag,
      0,
      end.x,
      end.y
    ].join(" ");

    return d;
  }

  getUnitStatusUpdates(unit) {
    let updates = [];

    if (
      this.activeAnimEvt.getCurrentEventName() === "CardReplaceEvent" &&
      this.activeAnimEvt.isInvoker(unit.unitId)
    ) {
      updates.push(<StatusCard type="ticks">REPLACE CARD</StatusCard>);
    }

    if (
      (this.activeAnimEvt.hasActiveStatChange(unit.unitId) ||
        this.activeAnimEvt.hasActiveStatusEffectChange(unit.unitId)) &&
      unit.knockoutAnimationPlayed !== true
    ) {
      let statChanges = this.activeAnimEvt.getActiveStatChanges(unit.unitId);
      let statusEffectChanges = this.activeAnimEvt.getActiveStatusEffectChanges(
        unit.unitId
      );

      let changes = [statChanges];
      for (let _arrIdx in changes) {
        let _arr = changes[_arrIdx];
        for (let _stat in _arr) {
          if (!_arr.hasOwnProperty(_stat)) continue;
          let value = _arr[_stat].delta;

          if (_stat === "TICKS") {
            value = (value < 0 ? "-" : "+") + Math.abs(value).toFixed(0);
          } else {
            value = (value < 0 ? "-" : "+") + Math.abs(value).toFixed(2);
          }
          //let delta = this.activeAnimEvt.currentTimeDelta();

          let type =
            _stat === "TICKS" ? "ticks" : value < 0 ? "negative" : "positive";

          updates.push(
            <StatusCard type={type}>
              {_stat}: {value}
            </StatusCard>
          );
        }
      }

      changes = [statusEffectChanges];
      for (let _arrIdx in changes) {
        let _arr = changes[_arrIdx];
        for (let _stat in _arr) {
          if (!_arr.hasOwnProperty(_stat)) continue;
          let value = _arr[_stat];
          //let delta = this.activeAnimEvt.currentTimeDelta();

          let charValue = "";
          for (
            let valueCounter = 0;
            valueCounter < Math.abs(value);
            valueCounter++
          ) {
            charValue +=
              value > 0
                ? String.fromCharCode(0x2191)
                : String.fromCharCode(0x2193);
          }

          let type =
            _stat === "TAUNT" || _stat === "POISON" ? "negative" : "positive";

          if (_stat === "TAUNT" || _stat === "SHIELD") {
            updates.push(<StatusCard type={type}>{_stat}</StatusCard>);
          } else {
            updates.push(
              <StatusCard type={type}>
                {_stat} {charValue}
              </StatusCard>
            );
          }
        }
      }
    }

    return updates;
  }

  render() {
    console.log("** Rendering the Character Status Displays **");

    let units = [];
    for (let unit of this.props.unitSelectionFields.getUnits()) {
      let percHealthRemaining = this.getHealthPosition(unit) * 100;
      let ticksRemaining = unit.ticks;
      const enemy = unit.team === "two";

      if (unit.state === "UNCONSCIOUS") {
        percHealthRemaining = 0;
        ticksRemaining = 0;
      }

      let unitStatusUpdates = this.getUnitStatusUpdates(unit);

      let statusEffectChanges = this.props.activeAnimEvt.getActiveStatusEffectChanges(
        unit.unitId
      );
      let hasPoison =
        statusEffectChanges.POISON > 0 || unit.statusEffects.POISON > 0;
      let hasRegenerate =
        statusEffectChanges.REGENERATE > 0 || unit.statusEffects.REGENERATE > 0;
      let hasShield =
        statusEffectChanges.SHIELD > 0 || unit.statusEffects.SHIELD > 0;
      let hasTaunt =
        statusEffectChanges.TAUNT > 0 || unit.statusEffects.TAUNT > 0;
      let hasCounterattack =
        statusEffectChanges.COUNTERATTACK > 0 ||
        unit.statusEffects.COUNTERATTACK > 0;

      units.push(
        <div>
          <div
            style={{
              top: unit.position.above.y / 2 - 25,
              left: (unit.position.above.x - HEALTH_BAR_WIDTH) / 2 - 5
            }}
            className={lstyle.statusEffects}
          >
            <span
              className={[
                lstyle.statusEffect,
                lstyle.statusEffectPoison,
                hasPoison ? lstyle.visible : ""
              ].join(" ")}
            ></span>
            <span
              className={[
                lstyle.statusEffect,
                lstyle.statusEffectRegenerate,
                hasRegenerate ? lstyle.visible : ""
              ].join(" ")}
            ></span>
            <span
              className={[
                lstyle.statusEffect,
                lstyle.statusEffectShield,
                hasShield ? lstyle.visible : ""
              ].join(" ")}
            ></span>
            <span
              className={[
                lstyle.statusEffect,
                lstyle.statusEffectTaunt,
                hasTaunt ? lstyle.visible : ""
              ].join(" ")}
            ></span>
            <span
              className={[
                lstyle.statusEffect,
                lstyle.statusEffectCounterattack,
                hasCounterattack ? lstyle.visible : ""
              ].join(" ")}
            ></span>
          </div>

          {/* Hp Bar */}
          <Box
            style={{
              top: unit.position.above.y / 2,
              left: (unit.position.above.x - HEALTH_BAR_WIDTH) / 2
            }}
            css={{
              position: "absolute",
              w: 80,
              h: 5
            }}
          >
            <Box
              as="span"
              css={{
                w: `${Math.round(percHealthRemaining)}%`,
                bg: enemy ? "$red-500" : "$green-500",
                position: "relative",
                h: "100%"
              }}
            />
          </Box>

          {/* Tick bar */}
          <Box
            as="svg"
            css={{
              position: "absolute",
              h: TICKS_RADIUS * 2,
              w: TICKS_RADIUS * 2,
              top: unit.position.above.y / 2 + 8,
              left: enemy
                ? unit.position.above.x / 2 + 26
                : unit.position.above.x / 2 - (HEALTH_BAR_WIDTH - 32)
            }}
          >
            <Box
              as="circle"
              stroke-width={TICKS_STROKE_WIDTH}
              fill="transparent"
              r={TICKS_RADIUS - TICKS_STROKE_WIDTH}
              cx={TICKS_RADIUS}
              cy={TICKS_RADIUS}
              css={{
                stroke: enemy
                  ? "rgba(255, 94, 124, 0.2)"
                  : "rgba(140, 190, 114, 0.2)"
              }}
            />
            <Box
              as="path"
              d={this.describeArc(
                TICKS_RADIUS,
                TICKS_RADIUS,
                TICKS_RADIUS - TICKS_STROKE_WIDTH,
                0,
                (360 * ticksRemaining) / 100
              )}
              fill="transparent"
              stroke-width={TICKS_STROKE_WIDTH}
              css={{
                stroke: enemy ? "$red-500" : "$green-500"
              }}
            />
          </Box>

          <div
            style={{
              top: unit.position.above.y / 2 + 100,
              left: (unit.position.above.x - HEALTH_BAR_WIDTH) / 2
            }}
            className={lstyle.unitStatusUpdates}
          >
            {unitStatusUpdates}
          </div>
        </div>
      );
    }

    return <div>{units}</div>;
  }
}
