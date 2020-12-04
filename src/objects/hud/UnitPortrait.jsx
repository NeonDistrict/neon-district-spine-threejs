import { HUDElement } from './HUDElement.jsx';
import HUDSTYLES from "../../data/hudStyles.js";

export class UnitPortrait extends HUDElement {

  update(delta, obj) {
    if (obj && obj.hasOwnProperty('x')) {
      this.center.x = obj.x;
    }
    this.drawRhombus();
    this.drawHead();
    this.writeTicks();
    this.drawKnockedOutOverlay();
  }

  drawRhombus() {
    this.context.fillStyle = HUDSTYLES.colors.darkGray;
    this.context.strokeStyle = HUDSTYLES.colors.halfGray;

    this.context.beginPath();
    this.context.moveTo(this.center.x - this.width/2 + this.width/12, this.center.y - this.height/2);
    this.context.lineTo(this.center.x + this.width/2 + this.width/12, this.center.y - this.height/2);
    this.context.lineTo(this.center.x + this.width/2 - this.width/12, this.center.y + this.height/2);
    this.context.lineTo(this.center.x - this.width/2 - this.width/12, this.center.y + this.height/2);
    this.context.lineTo(this.center.x - this.width/2 + this.width/12, this.center.y - this.height/2);
    this.context.fill();
  }

  drawKnockedOutOverlay() {
    if (this.unit.stats.HEALTH > 0) {
      return;
    }

    this.context.fillStyle = HUDSTYLES.colors.transparentDarkGray;

    this.context.beginPath();
    this.context.moveTo(this.center.x - this.width/2 + this.width/12, this.center.y - this.height/2);
    this.context.lineTo(this.center.x + this.width/2 + this.width/12, this.center.y - this.height/2);
    this.context.lineTo(this.center.x + this.width/2 - this.width/12, this.center.y + this.height/2);
    this.context.lineTo(this.center.x - this.width/2 - this.width/12, this.center.y + this.height/2);
    this.context.lineTo(this.center.x - this.width/2 + this.width/12, this.center.y - this.height/2);
    this.context.fill();
  }

  drawHead() {
    if (this.unit && this.unit.headImgLoaded) {      
      if (this.unit.team === 'two') {
        this.context.save();
        this.context.translate(this.center.x * 2 - this.width/12, 0);
        this.context.scale(-1, 1);
      }

      this.context.drawImage(
        this.unit.headImg, 
        this.center.x - this.width/2 + this.width/12, 
        this.center.y - this.height/2 + (this.height - this.width * 11/12),
        this.width * 11/12,
        this.width * 11/12
      );

      // Undo
      if (this.unit.team === 'two') {
        this.context.restore();
      }
    }
  }

  writeTicks() {
    if (this.unit.stats.HEALTH <= 0) {
      return;
    }

    this.context.fillStyle = HUDSTYLES.colors.neonBlue;
    this.context.strokeStyle = HUDSTYLES.colors.neonBlue;

    this.context.shadowColor = HUDSTYLES.colors.neonBlue;
    this.context.shadowBlur = 4;

    this.context.font = '16pt "kozuka-gothic-pr6n-bold"';
    this.context.textAlign = 'right';
    this.context.textBaseline = 'middle';
    this.context.fillText(
      this.unit.ticks,
      this.center.x + this.width/2 - this.width/(12*2),
      this.center.y - this.height/2 + this.height/7
    );

    this.context.shadowBlur = 0;
  }

}
