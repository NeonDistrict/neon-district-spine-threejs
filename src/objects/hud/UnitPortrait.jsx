import { HUDElement } from './HUDElement.jsx';
import HUDSTYLES from "../../data/hudStyles.js";

export class UnitPortrait extends HUDElement {

  update(delta) {
    this.drawRhombus();
    this.writeTicks();
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
    this.context.stroke();
  }

  writeTicks() {
    this.context.fillStyle = HUDSTYLES.colors.neonBlue;
    this.context.strokeStyle = HUDSTYLES.colors.neonBlue;

    this.context.shadowColor = HUDSTYLES.colors.neonBlue;
    this.context.shadowBlur = 2;

    this.context.font = '8pt "kozuka-gothic-pr6n-bold"';
    this.context.textAlign = 'right';
    this.context.fillText(40,
      this.center.x + this.width/2 - this.width/12,
      this.center.y - this.height/2 + this.height/4
    );

    this.context.shadowBlur = 0;
  }

}
