import { HUDElement } from './HUDElement.jsx';
import { ImageCache } from '../ImageCache.jsx';
import HUDSTYLES from "../../data/hudStyles.js";

export class CardFull extends HUDElement {

  constructor(obj) {
    super(obj);
    this.card = obj.card;

    this.imageCache = new ImageCache();
    this.imageCache.pullImages();

    this.roundRectRadius = 8;
    this.borderWidth = Math.floor(this.width * 21 / 634);
    this.topCircleRadius = this.width * 60 / 634;
    this.typeCenter = {
      x : this.center.x - this.width/2 + this.borderWidth + this.topCircleRadius + 2,
      y : this.center.y - this.height/2 + this.borderWidth + this.topCircleRadius - 8
    };
    this.tickCostCenter = {
      x : this.center.x + this.width/2 - (this.borderWidth + this.topCircleRadius + 2),
      y : this.center.y - this.height/2 + this.borderWidth + this.topCircleRadius - 8
    };
    this.bottomCircleRadius = this.width * 50 / 634;
    this.gainCenter = {
      x : this.center.x + this.width/2 - this.bottomCircleRadius,
      y : this.center.y + this.height/2 - this.bottomCircleRadius
    };
  }

  update(card) {
    if (this.hudLocked) {
      this.drawCardBack();
      this.drawBackBorder();
      this.drawNDLogo();
      return;
    }

    this.card = card;
    this.drawCardBack();
    this.drawTypeCircle();
    this.drawTickCostCircle();
    this.writeTicks();
    this.writeName();
    this.writeEffects();
    this.writeExploits();
    this.drawBorder();
    this.drawGainCircle();
  }

  drawTypeCircle() {
    //this.context.fillStyle = (this.hudLocked) ? this.getTypeTransparentPrimaryColor(this.card.type) : this.getTypePrimaryColor(this.card.type);
    this.context.fillStyle = HUDSTYLES.colors.darkGray;

    this.context.beginPath();
    this.context.arc(
      this.typeCenter.x,
      this.typeCenter.y,
      this.topCircleRadius,
      0, 2 * Math.PI
    );
    this.context.fill();

    // Pull down the image
    this.context.drawImage(
      this.imageCache.getImage(this.card.type), 
      this.typeCenter.x - this.topCircleRadius * 1.25 / 2,
      this.typeCenter.y - this.topCircleRadius * 1.25 / 2,
      this.topCircleRadius * 1.25,
      this.topCircleRadius * 1.25
    );
  }

  drawNDLogo() {
    // Pull down the image
    let ndlogo = this.imageCache.getImage('NDLOGO');
    let height = ndlogo.height / ndlogo.width * this.width / 2;
    this.context.drawImage(
      ndlogo, 
      this.center.x - this.width/4,
      this.center.y - height/2,
      this.width/2,
      height
    );
  }

  drawTickCostCircle() {
    //this.context.fillStyle = (this.hudLocked) ? this.getTypeTransparentPrimaryColor(this.card.type) : this.getTypePrimaryColor(this.card.type);
    this.context.fillStyle = HUDSTYLES.colors.darkGray;

    this.context.beginPath();
    this.context.arc(
      this.tickCostCenter.x,
      this.tickCostCenter.y,
      this.topCircleRadius,
      0, 2 * Math.PI
    );
    this.context.fill();
  }

  drawGainCircle() {
    this.context.fillStyle = this.getTypePrimaryColor(this.card.type);

    this.context.beginPath();
    this.context.arc(
      this.gainCenter.x,
      this.gainCenter.y,
      this.bottomCircleRadius,
      0, 2 * Math.PI
    );
    this.context.fill();

    // Fill in the gap between the border and the circle
    this.context.fillRect(
      this.gainCenter.x,
      this.gainCenter.y,
      this.bottomCircleRadius * (4/5),
      this.bottomCircleRadius * (4/5)
    );
  }

  drawCardBack() {
    this.context.fillStyle = HUDSTYLES.colors.darkGray;
    this.roundRect(
      this.center.x - this.width / 2,
      this.center.y - this.height / 2,
      this.width,
      this.height,
      this.roundRectRadius, true, false
    );
  }

  drawBorder() {
    this.context.strokeStyle = (this.hudLocked) ? this.getTypeTransparentPrimaryColor(this.card.type) : this.getTypePrimaryColor(this.card.type);
    this.context.lineWidth = this.borderWidth;

    this.roundRect(
      this.center.x - this.width / 2,
      this.center.y - this.height / 2,
      this.width,
      this.height,
      this.roundRectRadius, false, true
    );
  }

  drawBackBorder() {
    this.context.strokeStyle = HUDSTYLES.colors.transparentPurple;
    this.context.lineWidth = this.borderWidth;

    this.roundRect(
      this.center.x - this.width / 2,
      this.center.y - this.height / 2,
      this.width,
      this.height,
      this.roundRectRadius, false, true
    );
  }

  writeTicks() {
    this.context.fillStyle = HUDSTYLES.colors.white;
    this.context.strokeStyle = HUDSTYLES.colors.white;

    this.context.font = '14pt "kozuka-gothic-pr6n-bold"';
    this.context.textAlign = 'center';
    this.context.textBaseline = 'alphabetic';
    this.context.fillText(
      this.card.tickCost,
      this.tickCostCenter.x,
      this.tickCostCenter.y + 3
    );

    // Under Ticks Line
    this.context.lineWidth = 1.0;
    this.context.strokeStyle = this.getTypePrimaryColor(this.card.type);
    this.context.beginPath();
    this.context.moveTo(
      this.tickCostCenter.x - this.topCircleRadius * (4/5),
      this.tickCostCenter.y + 6
    );
    this.context.lineTo(
      this.tickCostCenter.x + this.topCircleRadius * (4/5),
      this.tickCostCenter.y + 6
    );
    this.context.stroke();

    this.context.font = '6pt "kozuka-gothic-pr6n-bold"';
    this.context.textAlign = 'center';
    this.context.textBaseline = 'top';
    this.context.fillText(
      "TICKS",
      this.tickCostCenter.x,
      this.tickCostCenter.y + 9
    );
  }

  writeName() {
    this.context.fillStyle = HUDSTYLES.colors.white;
    this.context.strokeStyle = HUDSTYLES.colors.white;

    this.context.font = '12pt "kozuka-gothic-pr6n-bold"';
    this.context.textAlign = 'center';
    this.context.textBaseline = 'top';

    let name = this.getLines(this.card.name, this.width * 2/3);
    for (let _idx = 0; _idx < name.length; _idx++) {
      this.context.fillText(
        name[_idx],
        this.center.x,
        this.center.y - this.height / 2 + this.borderWidth + 3 + 20 * _idx
      );
    }
  }

  writeEffects() {
    this.context.fillStyle = HUDSTYLES.colors.white;
    this.context.strokeStyle = HUDSTYLES.colors.white;

    this.context.font = '12pt "kozuka-gothic-pr6n-bold"';
    this.context.textAlign = 'center';
    this.context.textBaseline = 'top';

    let effects = this.getLines(this.card.effects, this.width * 3/4);
    for (let _idx = 0; _idx < effects.length; _idx++) {
      this.context.fillText(
        effects[_idx],
        this.center.x,
        this.center.y - this.height * 3 / 16 + 20 * _idx
      );
    }
  }

  writeExploits() {
    this.context.fillStyle = HUDSTYLES.colors.white;
    this.context.strokeStyle = HUDSTYLES.colors.white;

    this.context.font = '12pt "kozuka-gothic-pr6n-bold"';
    this.context.textAlign = 'center';
    this.context.textBaseline = 'top';

    let exploits = this.getLines(this.card.exploits, this.width * 3/4);
    for (let _idx = 0; _idx < exploits.length; _idx++) {
      this.context.fillText(
        exploits[_idx],
        this.center.x,
        this.center.y + this.height * 5 / 32 + 20 * _idx
      );
    }
  }

  getTypePrimaryColor(type) {
    switch (type) {
      case 'ABILITY': return HUDSTYLES.colors.green;
      case 'ATTACK': return HUDSTYLES.colors.red;
      case 'EFFECT': return HUDSTYLES.colors.yellow;
      case 'INTERACT': return HUDSTYLES.colors.neonBlue;
      default: return HUDSTYLES.colors.darkGray;
    }
  }

  getTypeDesaturatedPrimaryColor(type) {
    switch (type) {
      case 'ABILITY': return HUDSTYLES.colors.desaturatedGreen;
      case 'ATTACK': return HUDSTYLES.colors.desaturatedRed;
      case 'EFFECT': return HUDSTYLES.colors.desaturatedYellow;
      case 'INTERACT': return HUDSTYLES.colors.desaturatedNeonBlue;
      default: return HUDSTYLES.colors.darkGray;
    }
  }

  getTypeTransparentPrimaryColor(type) {
    switch (type) {
      case 'ABILITY': return HUDSTYLES.colors.transparentGreen;
      case 'ATTACK': return HUDSTYLES.colors.transparentRed;
      case 'EFFECT': return HUDSTYLES.colors.transparentYellow;
      case 'INTERACT': return HUDSTYLES.colors.transparentNeonBlue;
      default: return HUDSTYLES.colors.darkGray;
    }
  }
}