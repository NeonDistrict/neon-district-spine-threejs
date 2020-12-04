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
    this.writeUnitUpdates(position);
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

  writeUnitUpdates(position) {
    if (
      this.activeAnimEvt.hasActiveStatChange(this.unit.unitId) ||
      this.activeAnimEvt.hasActiveStatusEffectChange(this.unit.unitId)
    ) {
      let idx = 0;

      let statChanges = this.activeAnimEvt.getActiveStatChanges(this.unit.unitId);
      let statusEffectChanges = this.activeAnimEvt.getActiveStatusEffectChanges(this.unit.unitId);
      let updates = [statChanges, statusEffectChanges];

      for (let _arrIdx in updates) {
        let _arr = updates[_arrIdx];
        for (let _stat in _arr) {
          if (!_arr.hasOwnProperty(_stat)) continue;
          let value = _arr[_stat];
          let delta = this.activeAnimEvt.currentTimeDelta();
          let relPosition = {
            x : position.target.x + position.target.width / 2,
            y : position.target.y + 40 * ++idx + delta * 20
          };
          this.writeUnitUpdate(relPosition, _stat, value, _arrIdx == 1);
        }
      }
    }
  }

  writeUnitUpdate(position, stat, value, isStatusEffect) {
    let color;
    let delta = this.activeAnimEvt.currentTimeDelta();
    let alpha = 0.4 + delta * 6.0 / 10.0;

    let parsedValue;
    if (stat === 'TICKS' && value > 0) {
      color = `rgba(10,245,247,${alpha})`;
      parsedValue = "+" + String(Math.abs(value));
    } else if ((stat === 'TICKS' && value <= 0) || value >= 0) {
      color = `rgba(64,190,144,${alpha})`;
      if (stat === 'TICKS') {
        parsedValue = "-" + String(Math.abs(value));
      } else {
        parsedValue = "+" + String(Math.abs(value));
      }
    } else {
      color = `rgba(255,0,47,${alpha})`;
      parsedValue = "-" + String(Math.abs(value));
    }

    let str = stat + ": " + parsedValue;
    if (isStatusEffect) {
      let charValue = (value > 0) ? String.fromCharCode(0x2191) : String.fromCharCode(0x2193);
      parsedValue = "";
      for (let idx = 1; idx <= Math.abs(value); idx++) {
        parsedValue += charValue;
      }
      str = stat + " " + parsedValue;
    }

    this.context.fillStyle = color;
    //this.context.lineWidth = 1;
    //this.context.strokeStyle = `rgba(255,255,255,${alpha})`;

    this.context.shadowColor = `rgba(255,255,255,${alpha})`;
    this.context.shadowBlur = 4;

    this.context.font = '24pt "kozuka-gothic-pr6n-bold"';
    this.context.textAlign = 'center';
    this.context.textBaseline = 'middle';

    this.context.fillText(
      str,
      position.x,
      position.y
    );

    /*
    this.context.strokeText(
      str,
      position.x,
      position.y
    );
    */

    this.context.shadowBlur = 0;
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

    this.context.fillStyle = HUDSTYLES.colors.desaturatedRed;
    this.context.fillRect(
      position.above.x - this.healthWidth/2,
      position.above.y,
      this.healthWidth * percHealthRemaining,
      this.healthHeight
    );
  }

  getHealthPosition() {
    let health = this.unit.stats.HEALTH;

    if (this.activeAnimEvt.activeStatChange(this.unit.unitId, 'HEALTH') !== false) {
      let healthStatChange = this.activeAnimEvt.activeStatChange(this.unit.unitId, 'HEALTH');
      let animDelta = this.activeAnimEvt.currentTimeDelta();
      let prevHealth = Math.max(Math.min(this.unit.stats.HEALTH - healthStatChange, this.unit.statsMax.HEALTH), 0.0);
      health = (
        prevHealth + healthStatChange * Math.max(Math.min(1.0 - animDelta * 2.0, 1.0), 0.0)
      );
    }

    return Math.max(
      Math.min(
        health / this.unit.statsMax.HEALTH,
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

    if (this.activeAnimEvt.activeStatChange(this.unit.unitId, 'TICKS') !== false) {
      let ticksChange = this.activeAnimEvt.activeStatChange(this.unit.unitId, 'TICKS');
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
