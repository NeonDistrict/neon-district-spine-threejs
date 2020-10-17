import { HUDElement } from './HUDElement.jsx';
import HUDSTYLES from "../../data/hudStyles.js";
//import { UnitPortrait } from './UnitPortrait.jsx';

export class PlayerControlsDisplay extends HUDElement {

  constructor(obj) {
    super(obj);
    this.registerButtons();
  }

  registerButtons() {
    window.dispatchEvent(
      new CustomEvent("registerClickableRegion", {
        'detail' : {
          'option' : 'attack',
          'region' : [
            this.width * 1 / 8,
            this.height * 3 / 4,
            this.width * 1 / 8 + this.width * 1 / 8,
            this.height * 3 / 4 + this.height * 1 / 12
          ]
        }
      })
    );
  }

  setControls(controls) {
    //this.init();
  }

  init() {
  }

  update(delta) {
    this.drawRegion();
    this.drawButtons();
  }

  drawRegion() {
    let gradient = this.context.createLinearGradient(0, this.height * 2/3, 0, this.height);
    gradient.addColorStop(0, 'rgba(0,0,0,0.0)');
    gradient.addColorStop(0.25, 'rgba(0,0,0,1.0)');
    gradient.addColorStop(1.0, 'rgba(0,0,0,1.0)');

    this.context.fillStyle = gradient;
    this.context.fillRect(0, this.height * 2 / 3, this.width, this.height * 1 / 3);
  }

  drawButtons() {
    this.drawBaseAttackButton();
  }

  drawBaseAttackButton() {
    // Button Region
    this.context.fillStyle = HUDSTYLES.colors.darkGray;
    this.context.fillRect(this.width * 1 / 8, this.height * 3 / 4, this.width * 1 / 8, this.height * 1 / 12);



    // Text
    this.context.fillStyle = HUDSTYLES.colors.neonBlue;
    this.context.strokeStyle = HUDSTYLES.colors.neonBlue;

    this.context.shadowColor = HUDSTYLES.colors.neonBlue;
    this.context.shadowBlur = 2;

    this.context.font = '12pt "kozuka-gothic-pr6n-bold"';
    this.context.textAlign = 'center';
    this.context.fillText("BASE ATTACK",
      this.width * 1 / 8 + this.width * 1 / 16,
      this.height * 3 / 4 + this.height * 1 / 24
    );

    this.context.shadowBlur = 0;
  }

}
