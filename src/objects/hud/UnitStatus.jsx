import { HUDElement } from './HUDElement.jsx';
import HUDSTYLES from "../../data/hudStyles.js";

export class UnitStatus extends HUDElement {

  constructor(obj) {
    super(obj);
    this.unit = obj.unit;
    this.getUnitPosition = obj.getUnitPosition;
    this.healthWidth = 160;
    this.healthHeight = 10;
    this.ticksRadius = 12;
    this.ticksHealthGap = 4;
    this.ticksLineWidth = 4;

    this.registerUnitTarget();
  }

  registerUnitTarget() {
    let position = this.getUnitPosition(this.unit.character);

    window.dispatchEvent(
      new CustomEvent("registerClickableRegion", {
        'detail' : {
          'option' : 'target-' + this.unit.unitId,
          'region' : [
            position.target.x / 2.0,
            position.target.y / 2.0,
            (position.target.x + position.target.width) / 2.0,
            (position.target.y + position.target.height) / 2.0
          ]
        }
      })
    );
  }

  update(delta) {
    // Get the position
    let position = this.getUnitPosition(this.unit.character);
    this.drawHealth(position);
    this.drawTicks(position);
    //this.drawUnitTarget(position);
  }

  drawUnitTarget(position) {
    this.context.strokeStyle = HUDSTYLES.colors.red;
    this.context.strokeRect(
      position.target.x,
      position.target.y,
      position.target.width,
      position.target.height
    );
  }

  drawHealth(position) {
    this.context.fillStyle = HUDSTYLES.colors.transparentRed;
    this.context.fillRect(
      position.above.x - this.healthWidth/2,
      position.above.y,
      this.healthWidth,
      this.healthHeight
    );

    let percHealthRemaining = this.getHealthPosition();

    this.context.fillStyle = HUDSTYLES.colors.red;
    this.context.fillRect(
      position.above.x - this.healthWidth/2,
      position.above.y,
      this.healthWidth * percHealthRemaining,
      this.healthHeight
    );
  }

  getHealthPosition() {
    let health = this.unit.stats.health;

    if (this.activeAnimEvt.activeStatChange(this.unit.unitId, 'health') !== false) {
      let healthStatChange = this.activeAnimEvt.activeStatChange(this.unit.unitId, 'health');
      let animDelta = this.activeAnimEvt.currentTimeDelta();
      let prevHealth = Math.max(Math.min(this.unit.stats.health - healthStatChange, this.unit.originalStats.health), 0.0);
      health = (
        prevHealth + healthStatChange * Math.max(Math.min(1.0 - animDelta * 2.0, 1.0), 0.0)
      );
    }

    return Math.max(
      Math.min(
        health / this.unit.originalStats.health,
        1.0
      ),
      0.0
    );
  }

  drawTicks(position) {
    this.context.beginPath();
    this.context.arc(
      position.above.x,
      position.above.y + this.ticksRadius * 2 + this.ticksHealthGap,
      this.ticksRadius,
      0,
      2*Math.PI
    );
    this.context.lineWidth=this.ticksLineWidth;
    this.context.strokeStyle=HUDSTYLES.colors.transparentNeonBlue;
    this.context.stroke();

    let percTicksRemaining = this.getTicksPosition();

    this.context.beginPath();
    this.context.arc(
      position.above.x,
      position.above.y + this.ticksRadius * 2 + this.ticksHealthGap,
      this.ticksRadius,
      1.5*Math.PI,
      Math.PI * ((1 - percTicksRemaining) * 2 + 1.5),
      true
    );
    this.context.lineWidth=this.ticksLineWidth;
    this.context.strokeStyle=HUDSTYLES.colors.neonBlue;
    this.context.stroke();
  }

  getTicksPosition() {
    let ticks = this.unit.ticks;

    if (this.activeAnimEvt.activeStatChange(this.unit.unitId, 'ticks') !== false) {
      let ticksChange = this.activeAnimEvt.activeStatChange(this.unit.unitId, 'ticks');
      let animDelta = this.activeAnimEvt.currentTimeDelta();
      let previousTicks = Math.max(ticks - ticksChange, 0);
      ticks = (
        previousTicks + ticksChange * Math.min(1.0 - animDelta, 1.0)
      );
    }

    return Math.max(
      Math.min(
        ticks / 100,
        1.0
      ),
      0.0
    );
  }

}
