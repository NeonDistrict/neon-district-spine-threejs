import { HUDElement } from './HUDElement.jsx';
import HUDSTYLES from "../../data/hudStyles.js";
//import { UnitPortrait } from './UnitPortrait.jsx';

export class PlayerControlsDisplay extends HUDElement {

  constructor(obj) {
    super(obj);
    this.registerButtons();
    this.init();
  }

  registerButtons() {
    window.dispatchEvent(
      new CustomEvent("registerClickableRegion", {
        'detail' : {
          'option' : 'attack',
          'region' : [
            this.width * 31/36,
            this.height * 2/3 + 60 + this.width * 3/36,
            this.width * 31/36 + this.width * 4/36,
            this.height * 2/3 + 60 + this.width * 3/36 + this.width * 1/36
          ]
        }
      })
    );
  }

  setControls(controls) {
    //this.init();
  }

  setTeams(teams) {
    this.teams = teams;
    this.init();
  }

  init() {
    this.units = [];
    if (
      !this.teams ||
      !this.teams.hasOwnProperty('one') ||
      !this.teams.hasOwnProperty('two')
    ) {
      return;
    }

    for (let _team of [this.teams.one, this.teams.two]) {
      for (let _prop in _team) {
        this.units.push(_team[_prop]);
      }
    }
  }

  update(delta) {
    this.drawRegion();
    this.drawPlayer();
    this.drawActions();
    this.drawTarget();
  }

  drawRegion() {
    let gradient = this.context.createLinearGradient(0, this.height * 2/3, 0, this.height);
    gradient.addColorStop(0, 'rgba(0,0,0,0.0)');
    gradient.addColorStop(0.2, 'rgba(0,0,0,1.0)');
    gradient.addColorStop(1.0, 'rgba(0,0,0,1.0)');

    this.context.fillStyle = gradient;
    this.context.fillRect(0, this.height * 2 / 3, this.width, this.height * 1 / 3);

    // Draw gray player lines
    this.context.strokeWidth = 0.5;
    this.context.strokeStyle = HUDSTYLES.colors.darkGray;

    // Top
    this.context.beginPath();
    this.context.moveTo(this.width * 1/36, this.height * 2 / 3 + 50);
    this.context.lineTo(this.width * 24/36, this.height * 2 / 3 + 50);
    this.context.stroke();

    // Bottom
    this.context.beginPath();
    this.context.moveTo(this.width * 1/36, this.height - 12);
    this.context.lineTo(this.width * 24/36, this.height - 12);
    this.context.stroke();

    // Draw red target lines
    this.context.strokeWidth = 0.5;
    this.context.strokeStyle = HUDSTYLES.colors.red;

    // Top
    this.context.beginPath();
    this.context.moveTo(this.width * 26/36, this.height * 2 / 3 + 50);
    this.context.lineTo(this.width * 35/36, this.height * 2 / 3 + 50);
    this.context.stroke();

    // Bottom
    this.context.beginPath();
    this.context.moveTo(this.width * 26/36, this.height - 12);
    this.context.lineTo(this.width * 35/36, this.height - 12);
    this.context.stroke();

    // Write text above the lines
    this.context.fillStyle = HUDSTYLES.colors.white;
    this.context.strokeStyle = HUDSTYLES.colors.white;
    this.context.shadowColor = HUDSTYLES.colors.white;
    this.context.shadowBlur = 2;

    this.context.font = '6.5pt "kozuka-gothic-pr6n-bold"';
    this.context.textAlign = 'left';

    // Player, Actions, Target
    this.context.fillText("PLAYER", this.width * 1/36, this.height * 2 / 3 + 42);
    this.context.fillText("ACTIONS", this.width * 6/36, this.height * 2 / 3 + 42);
    this.context.fillText("TARGET", this.width * 26/36, this.height * 2 / 3 + 42);

    this.context.shadowBlur = 0;
  }

  drawPlayer() {
    let gradient = this.context.createLinearGradient(0, this.height * 2/3 + 60, 0, this.height * 2/3 + 160);
    gradient.addColorStop(0, 'rgba(36,36,36,1.0)');
    gradient.addColorStop(1.0, 'rgba(63,88,88,1.0)');

    this.context.fillStyle = gradient;
    this.context.fillRect(this.width * 1/36, this.height * 2/3 + 60, this.width * 4/36, this.width * 4/36);

    if (!this.units || !this.units.length) return;

    this.unit = this.getActivePlayer();

    if (this.unit && this.unit.headImgLoaded) {
      if (this.unit.team === 'two') {
        this.context.save();
        this.context.translate(this.width * 6/36, 0);
        this.context.scale(-1, 1);
      }

      this.context.drawImage(
        this.unit.headImg, 
        this.width * 1/36, 
        this.height * 2/3 + 60,
        this.width * 4/36,
        this.width * 4/36
      );

      // Undo
      if (this.unit.team === 'two') {
        this.context.restore();
      }
    }
  }

  getActivePlayer() {
    return this.units.reduce((acc, curr) => {
      if (!acc) return curr;
      if (acc.ticks < curr.ticks) return acc;
      if (acc.ticks == curr.ticks) {
        if (acc.lastTurnOrder < curr.lastTurnOrder) return acc;
        return curr;
      }
      return curr;
    });
  }

  getDefaultTarget() {
    return this.units.reduce((acc, curr) => {
      if (!acc) return curr;
      if (acc.ticks > curr.ticks) return acc;
      if (acc.ticks == curr.ticks) {
        if (acc.lastTurnOrder > curr.lastTurnOrder) return acc;
        return curr;
      }
      return curr;
    });
  }

  drawTarget() {
    let gradient = this.context.createLinearGradient(0, this.height * 2/3 + 60, 0, this.height * 2/3 + 160);
    gradient.addColorStop(0, 'rgba(36,36,36,1.0)');
    gradient.addColorStop(1.0, 'rgba(79,40,48,1.0)');

    this.context.fillStyle = gradient;
    this.context.fillRect(this.width * 26/36, this.height * 2/3 + 60, this.width * 4/36, this.width * 4/36);

    if (!this.units || !this.units.length) return;

    // Special case, only one other target, so autoselect
    if (this.units.length === 2) {
      this.unit = this.getDefaultTarget();
    }

    if (this.unit && this.unit.headImgLoaded) {
      if (this.unit.team === 'two') {
        this.context.save();
        this.context.translate(this.width * (36 + 20)/36, 0);
        this.context.scale(-1, 1);
      }

      this.context.drawImage(
        this.unit.headImg, 
        this.width * 26/36, 
        this.height * 2/3 + 60,
        this.width * 4/36,
        this.width * 4/36
      );

      // Undo
      if (this.unit.team === 'two') {
        this.context.restore();
      }
    }
  }

  drawActions() {
    // Base Attack Button
    this.context.fillStyle = HUDSTYLES.colors.darkGray;
    this.context.strokeStyle = (this.hudLocked) ? HUDSTYLES.colors.transparentRed : HUDSTYLES.colors.red;
    this.roundRect(
      this.width * 6/36 + 5,
      this.height * 2/3 + 60 + 5,
      this.width * 4/36 - 5,
      this.width * 4/36 - 5,
      5, true, true
    );
    this.context.fillStyle = HUDSTYLES.colors.red;
    this.context.strokeStyle = HUDSTYLES.colors.red;

    this.context.font = '10pt "kozuka-gothic-pr6n-bold"';
    this.context.textAlign = 'center';
    this.context.textBaseline = "middle";
    this.context.fillText("BASE ATTACK",
      this.width * 8/36 + 5/2,
      this.height * 2/3 + 60 + this.width * 3/36 + this.width * 1/36/2 - 5/2
    );

    // Cards
    this.drawCard(0);
    this.drawCard(1);
    this.drawCard(2);

    // Confirm Button
    this.context.fillStyle = HUDSTYLES.colors.darkGray;
    this.context.strokeStyle = (this.hudLocked) ? HUDSTYLES.colors.lightGray : HUDSTYLES.colors.white;
    this.context.fillRect(this.width * 31/36, this.height * 2/3 + 60 + this.width * 3/36, this.width * 4/36, this.width * 1/36);
    this.context.strokeRect(this.width * 31/36, this.height * 2/3 + 60 + this.width * 3/36, this.width * 4/36, this.width * 1/36);

    this.context.fillStyle = (this.hudLocked) ? HUDSTYLES.colors.lightGray : HUDSTYLES.colors.white;
    this.context.strokeStyle = (this.hudLocked) ? HUDSTYLES.colors.lightGray : HUDSTYLES.colors.white;

    this.context.font = '10pt "kozuka-gothic-pr6n-bold"';
    this.context.textAlign = 'center';
    this.context.textBaseline = "middle";
    this.context.fillText("CONFIRM",
      this.width * 33/36,
      this.height * 2/3 + 60 + this.width * 3/36 + this.width * 1/36/2
    );
  }

  drawCard(cardNum = 0) {
    this.context.fillStyle = HUDSTYLES.colors.darkGray;
    this.context.strokeStyle = (this.hudLocked) ? HUDSTYLES.colors.transparentRed : HUDSTYLES.colors.red;
    this.roundRect(
      this.width * (10.5 + 4.5 * cardNum)/36 + 5,
      this.height * 2/3 + 60 + 5,
      this.width * 4/36 - 5,
      this.width * 4/36 - 5,
      5, true, true
    );
    this.context.fillStyle = HUDSTYLES.colors.red;
    this.context.strokeStyle = HUDSTYLES.colors.red;

    this.context.font = '10pt "kozuka-gothic-pr6n-bold"';
    this.context.textAlign = 'center';
    this.context.textBaseline = "middle";
    this.context.fillText("CARD #" + cardNum,
      this.width * (12.5 + 4.5 * cardNum)/36 + 5/2,
      this.height * 2/3 + 60 + this.width * 3/36 + this.width * 1/36/2 - 5
    );
  }

  roundRect(x, y, width, height, radius, fill, stroke) {
      if (typeof stroke == 'undefined') {
          stroke = true;
      }
      if (typeof radius === 'undefined') {
          radius = 5;
      }
      if (typeof radius === 'number') {
          radius = {tl: radius, tr: radius, br: radius, bl: radius};
      } else {
          var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
          for (var side in defaultRadius) {
              radius[side] = radius[side] || defaultRadius[side];
          }
      }

      this.context.beginPath();
      this.context.moveTo(x + radius.tl, y);
      this.context.lineTo(x + width - radius.tr, y);
      this.context.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
      this.context.lineTo(x + width, y + height - radius.br);
      this.context.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
      this.context.lineTo(x + radius.bl, y + height);
      this.context.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
      this.context.lineTo(x, y + radius.tl);
      this.context.quadraticCurveTo(x, y, x + radius.tl, y);
      this.context.closePath();

      if (fill) {
          this.context.fill();
      }
      if (stroke) {
          this.context.stroke();
      }
  }

}
