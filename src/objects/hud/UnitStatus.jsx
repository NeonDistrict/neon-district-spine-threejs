import { HUDElement } from './HUDElement.jsx';
import HUDSTYLES from "../../data/hudStyles.js";

export class UnitStatus extends HUDElement {

  constructor(obj) {
    super(obj);
    this.unit = obj.unit;
    this.getUnitPosition = obj.getUnitPosition;
    this.healthWidth = 80;
    this.healthHeight = 5;
    this.ticksRadius = 6;
  }

  update(delta) {
    // Get the position
    let position = this.getUnitPosition(this.unit.character);
    this.drawHealth(position);
    this.drawTicks(position);
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
      position.above.y + this.ticksRadius * 2 + 2,
      this.ticksRadius,
      0,
      2*Math.PI
    );
    this.context.lineWidth=2;
    this.context.strokeStyle=HUDSTYLES.colors.transparentNeonBlue;
    this.context.stroke();

    let percTicksRemaining = this.getTicksPosition();

    this.context.beginPath();
    this.context.arc(
      position.above.x,
      position.above.y + this.ticksRadius * 2 + 2,
      this.ticksRadius,
      1.5*Math.PI,
      Math.PI * ((1 - percTicksRemaining) * 2 + 1.5),
      true
    );
    this.context.lineWidth=2;
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

  writeTicks(position) {
    this.context.fillStyle = HUDSTYLES.colors.neonBlue;
    this.context.strokeStyle = HUDSTYLES.colors.neonBlue;

    this.context.shadowColor = HUDSTYLES.colors.neonBlue;
    this.context.shadowBlur = 2;

    this.context.font = '8pt "kozuka-gothic-pr6n-bold"';
    this.context.textAlign = 'center';
    this.context.fillText(40, position.above.x, position.above.y);

    this.context.shadowBlur = 0;
  }

}
