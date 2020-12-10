import { HUDElement } from './HUDElement.jsx';
import { CardFull } from './CardFull.jsx';
import { ImageCache } from '../ImageCache.jsx';
import HUDSTYLES from "../../data/hudStyles.js";

export class PlayerControlsDisplay extends HUDElement {

  constructor(obj) {
    super(obj);
    this.actions = ["attack","card0","card1","card2"];

    // Size constants
    this.vertGap = 120;
    this.bottomLineGap = 24;
    this.vertLineGap = 100;
    this.vertLabelGap = 84;
    this.cardInset = 6;
    this.shadowBlur = 4;
    this.selectRoundRectRadius = 16;
    this.roundRectRadius = 8;

    this.imageCache = new ImageCache();
    this.imageCache.pullImages();

    this.registerButtons();
    this.init();
  }

  registerButtons() {
    let canvasWidth = this.width / 2.0;
    let canvasHeight = this.height / 2.0;
    let canvasVertGap = this.vertGap / 2.0;

    window.dispatchEvent(
      new CustomEvent("registerClickableRegion", {
        'detail' : {
          'option' : 'confirm',
          'region' : [
            canvasWidth * 31/36,
            canvasHeight * 2/3 + canvasVertGap + canvasWidth * 3/36,
            canvasWidth * 31/36 + canvasWidth * 4/36,
            canvasHeight * 2/3 + canvasVertGap + canvasWidth * 3/36 + canvasWidth * 1/36
          ]
        }
      })
    );

    this.registerActionButtons();
  }

  registerActionButtons() {
    let canvasWidth = this.width / 2.0;
    let canvasHeight = this.height / 2.0;
    let canvasVertGap = this.vertGap / 2.0;

    for (let _idx in this.actions) {
      window.dispatchEvent(
        new CustomEvent("registerClickableRegion", {
          'detail' : {
            'option' : this.actions[_idx],
            'region' : [
              canvasWidth * (6 + 4.5 * _idx)/36 + 10,
              canvasHeight * 2/3 + canvasVertGap + 10,
              canvasWidth * (6 + 4.5 * _idx)/36 + canvasWidth * 4/36,
              canvasHeight * 2/3 + canvasVertGap + canvasWidth * 4/36,
            ]
          }
        })
      );
    }
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

    this.cards = [];
    for (let _idx = 0; _idx <= 2; _idx++) {
      this.cards.push(
        new CardFull({
          'context' : this.context,
          'x'       : this.width * (12.5 + 4.5*_idx)/36 + this.cardInset / 2.0,
          'y'       : this.height * 2/3 + this.vertGap + this.width * 4/36/2 + this.cardInset / 2.0,
          'width'   : this.width * 4/36 - this.cardInset * 2.0,
          'height'  : this.width * 4/36 - this.cardInset * 2.0
        })
      );
    }
  }

  update(delta) {
    this.drawRegion();
    this.drawPlayer();
    this.drawActions();
    this.drawSelectedAction();
    this.drawTarget();

    if (!this.hudLocked) {
      this.drawAutomaticallySelectedActions();
    }
  }

  getSelectedAction() {
    if (this.playerSelections && this.playerSelections.getAction) {
      return this.playerSelections.getAction();
    }
  }

  getSelectedTarget() {
    if (this.playerSelections && this.playerSelections.getTarget) {
      return this.playerSelections.getTarget();
    }
  }

  drawRegion() {
    let gradient = this.context.createLinearGradient(0, this.height * 2/3, 0, this.height);
    gradient.addColorStop(0, 'rgba(0,0,0,0.0)');
    gradient.addColorStop(0.2, 'rgba(0,0,0,1.0)');
    gradient.addColorStop(1.0, 'rgba(0,0,0,1.0)');

    this.context.textBaseline = 'middle';

    this.context.fillStyle = gradient;
    this.context.fillRect(0, this.height * 2 / 3, this.width, this.height * 1 / 3);

    // Draw gray player lines
    this.context.strokeWidth = 0.5;
    this.context.strokeStyle = HUDSTYLES.colors.darkGray;

    // Top
    this.context.beginPath();
    this.context.moveTo(this.width * 1/36, this.height * 2 / 3 + this.vertLineGap);
    this.context.lineTo(this.width * 24/36, this.height * 2 / 3 + this.vertLineGap);
    this.context.stroke();

    // Bottom
    this.context.beginPath();
    this.context.moveTo(this.width * 1/36, this.height - this.bottomLineGap);
    this.context.lineTo(this.width * 24/36, this.height - this.bottomLineGap);
    this.context.stroke();

    // Draw red target lines
    this.context.strokeWidth = 0.5;
    this.context.strokeStyle = HUDSTYLES.colors.red;

    // Top
    this.context.beginPath();
    this.context.moveTo(this.width * 26/36, this.height * 2 / 3 + this.vertLineGap);
    this.context.lineTo(this.width * 35/36, this.height * 2 / 3 + this.vertLineGap);
    this.context.stroke();

    // Bottom
    this.context.beginPath();
    this.context.moveTo(this.width * 26/36, this.height - this.bottomLineGap);
    this.context.lineTo(this.width * 35/36, this.height - this.bottomLineGap);
    this.context.stroke();

    // Write text above the lines
    this.context.fillStyle = HUDSTYLES.colors.white;
    this.context.strokeStyle = HUDSTYLES.colors.white;
    this.context.shadowColor = HUDSTYLES.colors.white;
    this.context.shadowBlur = this.shadowBlur;

    this.context.font = '13pt "kozuka-gothic-pr6n-bold"';
    this.context.textAlign = 'left';

    // Player, Actions, Target
    this.context.fillText("PLAYER", this.width * 1/36, this.height * 2 / 3 + this.vertLabelGap);
    this.context.fillText("ACTIONS", this.width * 6/36, this.height * 2 / 3 + this.vertLabelGap);
    this.context.fillText("TARGET", this.width * 26/36, this.height * 2 / 3 + this.vertLabelGap);

    this.context.shadowBlur = 0;
  }

  drawPlayer() {
    let gradient = this.context.createLinearGradient(0, this.height * 2/3 + this.vertGap, 0, this.height * 2/3 + this.vertGap + this.width * 4/36);
    gradient.addColorStop(0, 'rgba(36,36,36,1.0)');
    gradient.addColorStop(1.0, 'rgba(63,88,88,1.0)');

    this.context.fillStyle = gradient;
    this.context.fillRect(this.width * 1/36, this.height * 2/3 + this.vertGap, this.width * 4/36, this.width * 4/36);

    if (!this.units || !this.units.length) return;

    let playerUnit = this.getActivePlayer();

    if (playerUnit && playerUnit.headImgLoaded) {
      if (playerUnit.team === 'two') {
        this.context.save();
        this.context.translate(this.width * 6/36, 0);
        this.context.scale(-1, 1);
      }

      this.context.drawImage(
        playerUnit.headImg, 
        this.width * 1/36, 
        this.height * 2/3 + this.vertGap,
        this.width * 4/36,
        this.width * 4/36
      );

      // Undo
      if (playerUnit.team === 'two') {
        this.context.restore();
      }
    }
  }

  getActivePlayer() {
    return this.units.reduce((acc, curr) => {
      if (!acc) return curr;
      if (curr.stats.HEALTH <= 0) return acc;
      if (acc.ticks < curr.ticks) return acc;
      if (acc.ticks == curr.ticks) {
        if (acc.lastTurnOrder < curr.lastTurnOrder) return acc;
        return curr;
      }
      return curr;
    });
  }

  getTarget() {
    for (let _idx in this.units) {
      if (this.units[_idx].unitId === this.playerSelections.getTarget()) {
        return this.units[_idx];
      }
    }
  }

  drawTarget() {
    let gradient = this.context.createLinearGradient(0, this.height * 2/3 + this.vertGap, 0, this.height * 2/3 + this.vertGap + this.width * 4/36);
    gradient.addColorStop(0, 'rgba(36,36,36,1.0)');
    gradient.addColorStop(1.0, 'rgba(79,40,48,1.0)');

    this.context.fillStyle = gradient;
    this.context.fillRect(this.width * 26/36, this.height * 2/3 + this.vertGap, this.width * 4/36, this.width * 4/36);

    if (!this.units || !this.units.length) return;

    let targetUnit = this.getTarget();

    if (targetUnit && targetUnit.headImgLoaded) {
      if (targetUnit.team === 'two') {
        this.context.save();
        this.context.translate(this.width * (36 + 20)/36, 0);
        this.context.scale(-1, 1);
      }

      this.context.drawImage(
        targetUnit.headImg, 
        this.width * 26/36, 
        this.height * 2/3 + this.vertGap,
        this.width * 4/36,
        this.width * 4/36
      );

      // Undo
      if (targetUnit.team === 'two') {
        this.context.restore();
      }
    }
  }

  drawSelectedAction() {
    let action = this.getSelectedAction();
    if (!action) return;

    let actionPlace = ["attack","card0","card1","card2"].indexOf(action);

    this.context.strokeStyle = HUDSTYLES.colors.white;
    this.context.lineWidth = 2.0;
    this.roundRect(
      this.width * (6 + 4.5 * actionPlace)/36,
      this.height * 2/3 + this.vertGap,
      this.width * 4/36 + this.cardInset,
      this.width * 4/36 + this.cardInset,
      this.selectRoundRectRadius, false, true // Not filling in, just stroke
    );
  }

  drawAutomaticallySelectedActions() {
    for (let cardIdx = 0; cardIdx < (this.playerSelections.getCards() || []).length ; cardIdx++) {
      let card = this.playerSelections.getCard(cardIdx);

      if (!card || !card.type || card.type.toLowerCase() !== 'effect') {
        continue;
      }

      //this.context.strokeStyle = HUDSTYLES.colors.white;
      this.context.strokeStyle = this.getTypePrimaryColor(card.type);
      this.context.lineWidth = 2.0;
      this.roundRect(
        this.width * (6 + 4.5 * (cardIdx + 1))/36,
        this.height * 2/3 + this.vertGap,
        this.width * 4/36 + this.cardInset,
        this.width * 4/36 + this.cardInset,
        this.selectRoundRectRadius, false, true // Not filling in, just stroke
      );
    }
  }

  drawActions() {
    // Base Attack Button
    this.context.fillStyle = HUDSTYLES.colors.darkGray;
    this.context.strokeStyle = (this.hudLocked) ? HUDSTYLES.colors.transparentRed : HUDSTYLES.colors.red;
    this.context.lineWidth = 4;
    this.roundRect(
      this.width * 6/36 + this.cardInset * 1.25,
      this.height * 2/3 + this.vertGap + this.cardInset * 1.25,
      this.width * 4/36 - this.cardInset * 1.5,
      this.width * 4/36 - this.cardInset * 1.5,
      this.roundRectRadius, true, true
    );
    this.context.fillStyle = HUDSTYLES.colors.red;
    this.context.strokeStyle = HUDSTYLES.colors.red;

    // Pull down the image
    this.context.drawImage(
      this.imageCache.getImage('ATTACK'),
      this.width * 7.25/36,
      this.height * 2/3 + this.vertGap + this.width * 1/36,
      this.width * 1.5/36,
      this.width * 1.5/36
    );

    this.context.font = '20pt "kozuka-gothic-pr6n-bold"';
    this.context.textAlign = 'center';
    this.context.textBaseline = "middle";
    this.context.fillText("BASE ATTACK",
      this.width * 8/36 + this.cardInset/2,
      this.height * 2/3 + this.vertGap + this.width * 3/36 + this.width * 1/36/2 - this.cardInset/2
    );

    this.writeTicks({
      x : this.width * 10/36 - 30,
      y : this.height * 2/3 + this.vertGap + 30
    });

    // Cards
    this.drawCard(0);
    this.drawCard(1);
    this.drawCard(2);

    // Confirm Button
    this.context.fillStyle = HUDSTYLES.colors.darkGray;
    this.context.strokeStyle = (this.hudLocked) ? HUDSTYLES.colors.lightGray : HUDSTYLES.colors.white;
    this.context.fillRect(this.width * 31/36, this.height * 2/3 + this.vertGap + this.width * 3/36, this.width * 4/36, this.width * 1/36);
    this.context.strokeRect(this.width * 31/36, this.height * 2/3 + this.vertGap + this.width * 3/36, this.width * 4/36, this.width * 1/36);

    this.context.fillStyle = (this.hudLocked) ? HUDSTYLES.colors.lightGray : HUDSTYLES.colors.white;
    this.context.strokeStyle = (this.hudLocked) ? HUDSTYLES.colors.lightGray : HUDSTYLES.colors.white;

    this.context.font = '20pt "kozuka-gothic-pr6n-bold"';
    this.context.textAlign = 'center';
    this.context.textBaseline = "middle";
    this.context.fillText("CONFIRM",
      this.width * 33/36,
      this.height * 2/3 + this.vertGap + this.width * 3/36 + this.width * 1/36/2
    );
  }

  drawCard(cardNum = 0) {
    if (this.cards && this.cards.length > cardNum) {
      this.cards[cardNum].update(this.playerSelections.getCard(cardNum));
    }
  }

  writeTicks(center, width = 30) {
    this.context.fillStyle = HUDSTYLES.colors.white;
    this.context.strokeStyle = HUDSTYLES.colors.white;

    this.context.font = '14pt "kozuka-gothic-pr6n-bold"';
    this.context.textAlign = 'center';
    this.context.textBaseline = 'alphabetic';
    this.context.fillText(
      40,
      center.x,
      center.y + 3
    );

    // Under Ticks Line
    this.context.lineWidth = 1.0;
    this.context.strokeStyle = HUDSTYLES.colors.red;
    this.context.beginPath();
    this.context.moveTo(
      center.x - width / 2,
      center.y + 6
    );
    this.context.lineTo(
      center.x + width / 2,
      center.y + 6
    );
    this.context.stroke();

    this.context.font = '6pt "kozuka-gothic-pr6n-bold"';
    this.context.textAlign = 'center';
    this.context.textBaseline = 'top';
    this.context.fillText(
      "TICKS",
      center.x,
      center.y + 9
    );
  }

}
