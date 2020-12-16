import { HUDElement } from './HUDElement.jsx';
import { ImageCache } from '../ImageCache.jsx';
import HUDSTYLES from "../../data/hudStyles.js";

export class CardFull extends HUDElement {

  constructor(obj) {
    super(obj);
    this.card = obj.card;
    this.hudLocked = true;

    this.imageCache = new ImageCache();
    //this.imageCache.pullImages();

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

  update(card, options = {}) {
    if (this.hudLocked || !card || (Object.keys(card).length === 0 && card.constructor === Object)) {
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
    //this.drawGainCircle();

    // If needed, display disabled overlay
    this.drawDisabledOverlay(options);
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

    if (!this.imageCache.getImage(this.card.type)) {
      return;
    }

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
    if (!ndlogo) {
      return;
    }

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
    this.context.lineWidth = this.borderWidth;
    if (this.hudLocked || !this.card || (Object.keys(this.card).length === 0 && this.card.constructor === Object)) {
      this.context.strokeStyle = HUDSTYLES.colors.transparentPurple;
    } else {
      this.context.strokeStyle = (this.hudLocked) ? this.getTypeTransparentPrimaryColor(this.card.type) : this.getTypePrimaryColor(this.card.type);
    }

    this.context.shadowColor = HUDSTYLES.colors.black;
    this.context.shadowBlur = 12;
    this.context.fillStyle = HUDSTYLES.colors.darkGray;
    this.roundRect(
      this.center.x - this.width / 2,
      this.center.y - this.height / 2,
      this.width,
      this.height,
      this.roundRectRadius, true, true
    );
    this.context.shadowBlur = 0;
  }

  drawDisabledOverlay(options) {
    if (this.card && this.card.type && (
        this.card.type.toLowerCase() === 'interact' || (options && options.isTaunted === true && this.card.type.toLowerCase() !== 'attack')
      )
    ) {
      this.context.strokeStyle = HUDSTYLES.colors.transparentDarkGray;
      this.context.fillStyle = HUDSTYLES.colors.transparentDarkGray;
      this.roundRect(
        this.center.x - this.width / 2 - this.roundRectRadius / 2 - 1,
        this.center.y - this.height / 2 - this.roundRectRadius / 2 - 1,
        this.width + this.roundRectRadius + 2,
        this.height + this.roundRectRadius + 2,
        this.roundRectRadius, true, false
      );
    }
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

    this.context.font = '16pt "kozuka-gothic-pr6n-bold"';
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
      this.tickCostCenter.y + 12
    );
    this.context.lineTo(
      this.tickCostCenter.x + this.topCircleRadius * (4/5),
      this.tickCostCenter.y + 12
    );
    this.context.stroke();

    this.context.font = '10pt "kozuka-gothic-pr6n-bold"';
    this.context.textAlign = 'center';
    this.context.textBaseline = 'top';
    this.context.fillText(
      "TICKS",
      this.tickCostCenter.x,
      this.tickCostCenter.y + 16
    );
  }

  writeName() {
    this.context.fillStyle = HUDSTYLES.colors.white;
    this.context.strokeStyle = HUDSTYLES.colors.white;

    this.context.font = '16pt "kozuka-gothic-pr6n-bold"';
    this.context.textAlign = 'center';
    this.context.textBaseline = 'top';

    let name = this.getLines(this.card.name, this.width * 1/2);
    for (let _idx = 0; _idx < name.length; _idx++) {
      this.context.fillText(
        name[_idx],
        this.center.x,
        this.center.y - this.height / 2 + this.borderWidth + 5 + 24 * _idx
      );
    }
  }

  writeEffects() {
    this.context.fillStyle = HUDSTYLES.colors.white;
    this.context.strokeStyle = HUDSTYLES.colors.white;

    this.context.font = '14pt "kozuka-gothic-pr6n"';
    this.context.textAlign = 'center';
    this.context.textBaseline = 'top';

    let effects = this.getLines(this.card.effects, this.width * 7/8);
    for (let _idx = 0; _idx < effects.length; _idx++) {
      this.context.fillText(
        effects[_idx],
        this.center.x,
        this.center.y - this.height * 3 / 16 + 23 * _idx
      );
    }
  }

  writeExploits() {
    this.context.fillStyle = HUDSTYLES.colors.white;
    this.context.strokeStyle = HUDSTYLES.colors.white;

    this.context.font = '14pt "kozuka-gothic-pr6n"';
    this.context.textAlign = 'center';
    this.context.textBaseline = 'top';

    let exploits = this.getLines(this.card.exploits, this.width * 7/8);
    for (let _idx = 0; _idx < exploits.length; _idx++) {
      this.context.fillText(
        exploits[_idx],
        this.center.x,
        this.center.y + this.height * 5 / 32 + 23 * _idx
      );
    }
  }
}
