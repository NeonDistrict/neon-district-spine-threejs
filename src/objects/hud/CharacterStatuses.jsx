import React, { Component } from "react";
import lstyle from "../../styles/hud.scss";

const HEALTH_BAR_WIDTH = 80;
const TICKS_RADIUS = 10;
const TICKS_STROKE_WIDTH = 3;

export class CharacterStatuses extends Component {

  getHealthPosition(unit) {
    let health = unit.stats.HEALTH;

    if (this.props.activeAnimEvt && this.props.activeAnimEvt.activeStatChange(unit.unitId, 'HEALTH') !== false) {
      let healthStatChange = this.props.activeAnimEvt.activeStatChange(unit.unitId, 'HEALTH');
      let animDelta = this.props.activeAnimEvt.currentTimeDelta();

      health = (
        healthStatChange.start + healthStatChange.delta //* Math.max(Math.min(1.0 - animDelta * 2.0, 1.0), 0.0)
      );

      // Update this unit's health
      unit.stats.HEALTH = health;
    }

    return Math.max(
      Math.min(
        health / unit.statsMax.HEALTH,
        1.0
      ),
      0.0
    );
  }

  polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    let angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;

    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  }

  describeArc(x, y, radius, startAngle, endAngle) {
    let start = this.polarToCartesian(x, y, radius, endAngle);
    let end = this.polarToCartesian(x, y, radius, startAngle);

    let largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    let d = [
        "M", start.x, start.y, 
        "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");

    return d;       
  }

  render() {
    console.log("** Rendering the Character Status Displays **");

    let units = [];
    for (let unit of this.props.unitSelectionFields.getUnits()) {
      console.log(unit);

      let percHealthRemaining = this.getHealthPosition(unit) * 100;
      let ticksRemaining = unit.ticks;

      if (unit.state === 'UNCONSCIOUS') {
        percHealthRemaining = 0;
        ticksRemaining = 0;
      }

      units.push(
        <div>
          <div style={{
            top:unit.position.above.y / 2,
            left:(unit.position.above.x - HEALTH_BAR_WIDTH) / 2
          }} className={lstyle.healthBarOuter}>
            <span style={{
              width: Math.round(percHealthRemaining) + "%"
            }} className={lstyle.healthBarFill}></span>
          </div>

          <svg style={{
            top:unit.position.above.y / 2 + 8,
            left:unit.position.above.x / 2 - TICKS_RADIUS
          }} className={lstyle.characterTicksRingOuter} height={TICKS_RADIUS * 2} width={TICKS_RADIUS * 2}>
            <circle
              className={lstyle.characterTicksRingBackfill}
              stroke-width={TICKS_STROKE_WIDTH}
              fill="transparent"
              r={TICKS_RADIUS-TICKS_STROKE_WIDTH}
              cx={TICKS_RADIUS}
              cy={TICKS_RADIUS}
            />
            <path
              className={lstyle.characterTicksRingFill}
              d={this.describeArc(TICKS_RADIUS, TICKS_RADIUS, TICKS_RADIUS - TICKS_STROKE_WIDTH, 0, 360 * ticksRemaining / 100)}
              fill="transparent"
              stroke-width={TICKS_STROKE_WIDTH}
            />
          </svg>
        </div>
      )
    }

    return (
      <div>
        {units}
      </div>
    );
  }

}
