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
    this.cardInset = 12;
    this.shadowBlur = 8;
    this.selectRoundRectRadius = 16;
    this.roundRectRadius = 8;

    // These are the base units that are multiples of the width
    this.cardWidth = 5;
    this.cardWidthDistance = 4.75;

    this.imageCache = new ImageCache();
    this.imageCache.pullImages();

    this.registerRegionLocations();
    this.registerButtons();
    this.init();
  }

  registerRegionLocations() {
    this.BORDER = {
      TOP : this.height * 2 / 3 + this.vertLineGap,
      INNER_TOP : this.height * 2/3 + this.vertGap,
      BOTTOM : this.height - this.bottomLineGap,
      LEFT : this.width * 1/36,
      RIGHT : this.width * 35/36
    };

    this.PLAYER_REGION = {
      RIGHT : this.width * 24/36
    }

    this.TARGET_REGION = {
      LEFT : this.width * 25/36
    };

    this.CONFIRM = {
      LEFT : this.width * 31.75/36,
      TOP : this.BORDER.INNER_TOP + this.width * 3.85/36,
      WIDTH : this.width * 3.25/36,
      HEIGHT : this.width * 0.85/36
    };

    this.ACTIONS = {
      LEFT : this.width * 5/36
    };

    this.ACTION_BUTTON = {
      OUTER_WIDTH : this.width * 4.75/36,
      WIDTH : this.width * 4.5/36 - this.cardInset
    };

    this.PLAYER_IMAGE = {
      WIDTH  : this.width * 3.5/36,
      HEIGHT : this.width * 3.5/36
    };

    this.TARGET_STATS = {
      TOP : this.BORDER.INNER_TOP + this.width * 0.75 / 36, // text
      LEFT : this.TARGET_REGION.LEFT + this.PLAYER_IMAGE.WIDTH + this.width * 0.5 / 36,
      RIGHT : this.BORDER.RIGHT - this.width * 0.5 / 36,
      TEXT_PADDING : 16
    };
    this.TARGET_STATS.WIDTH  = this.TARGET_STATS.RIGHT - this.TARGET_STATS.LEFT;
    this.TARGET_STATS.HEIGHT = this.CONFIRM.TOP - this.TARGET_STATS.TOP;
  }

  registerButtons() {
    window.dispatchEvent(
      new CustomEvent("registerClickableRegion", {
        'detail' : {
          'option' : 'confirm',
          'region' : [
            this.CONFIRM.LEFT / 2.0,
            this.CONFIRM.TOP / 2.0,
            (this.CONFIRM.LEFT + this.CONFIRM.WIDTH) / 2.0,
            (this.CONFIRM.TOP + this.CONFIRM.HEIGHT) / 2.0
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
              canvasWidth * (this.cardWidth + this.cardWidthDistance * _idx)/36 + this.cardWidth + this.cardInset * 0.5,
              canvasHeight * 2/3 + canvasVertGap + 5 + this.cardInset * 0.5,
              canvasWidth * (this.cardWidth + this.cardWidthDistance * _idx)/36 + canvasWidth * this.cardWidth/36 - this.cardInset * 0.5,
              canvasHeight * 2/3 + canvasVertGap + canvasWidth * 4.5/36 - this.cardInset * 0.5,
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
          'x'       : this.width * (12 + this.cardWidthDistance * _idx) / 36 + this.cardInset * 2.5 - this.cardInset * _idx,
          'y'       : this.BORDER.INNER_TOP + this.ACTION_BUTTON.OUTER_WIDTH/2,
          'width'   : this.ACTION_BUTTON.WIDTH - this.cardInset * 2.0,
          'height'  : this.ACTION_BUTTON.WIDTH - this.cardInset * 2.0
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
    this.drawTargetStats();

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
    // Common Settings
    this.context.textBaseline = 'middle';

    // Selected Character Portrait
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
    this.context.moveTo(this.BORDER.LEFT, this.BORDER.TOP);
    this.context.lineTo(this.PLAYER_REGION.RIGHT, this.BORDER.TOP);
    this.context.stroke();

    // Bottom
    this.context.beginPath();
    this.context.moveTo(this.BORDER.LEFT, this.BORDER.BOTTOM);
    this.context.lineTo(this.PLAYER_REGION.RIGHT, this.BORDER.BOTTOM);
    this.context.stroke();

    // Draw red target lines
    this.context.strokeWidth = 0.5;
    this.context.strokeStyle = HUDSTYLES.colors.desaturatedRed;

    // Top
    this.context.beginPath();
    this.context.moveTo(this.TARGET_REGION.LEFT, this.BORDER.TOP);
    this.context.lineTo(this.BORDER.RIGHT, this.BORDER.TOP);
    this.context.stroke();

    // Bottom
    this.context.beginPath();
    this.context.moveTo(this.TARGET_REGION.LEFT, this.BORDER.BOTTOM);
    this.context.lineTo(this.BORDER.RIGHT, this.BORDER.BOTTOM);
    this.context.stroke();

    // Write text above the lines
    this.context.fillStyle = HUDSTYLES.colors.white;
    this.context.strokeStyle = HUDSTYLES.colors.white;
    this.context.shadowColor = HUDSTYLES.colors.white;
    this.context.shadowBlur = this.shadowBlur;

    this.context.font = '15pt "kozuka-gothic-pr6n-bold"';
    this.context.textAlign = 'left';

    // Player, Actions, Target
    this.context.fillText("PLAYER", this.BORDER.LEFT, this.height * 2 / 3 + this.vertLabelGap);
    this.context.fillText("ACTIONS", this.ACTIONS.LEFT, this.height * 2 / 3 + this.vertLabelGap);
    this.context.fillText("TARGET", this.TARGET_REGION.LEFT, this.height * 2 / 3 + this.vertLabelGap);

    this.context.shadowBlur = 0;
  }

  drawPlayer() {
    // Draw Player Gradient
    let gradient = this.context.createLinearGradient(0, this.BORDER.INNER_TOP, 0, this.BORDER.INNER_TOP + this.PLAYER_IMAGE.WIDTH);
    gradient.addColorStop(0, 'rgba(36,36,36,1.0)');
    gradient.addColorStop(1.0, 'rgba(63,88,88,1.0)');
    this.context.fillStyle = gradient;
    this.context.fillRect(this.BORDER.LEFT, this.BORDER.INNER_TOP, this.PLAYER_IMAGE.WIDTH, this.PLAYER_IMAGE.HEIGHT);

    if (!this.units || !this.units.length) return;

    let playerUnit = this.getActivePlayer();

    if (playerUnit && playerUnit.headImgLoaded) {
      if (playerUnit.team === 'two') {
        this.context.save();
        this.context.translate(this.width * 5.5/36, 0);
        this.context.scale(-1, 1);
      }

      this.context.drawImage(
        playerUnit.headImg, 
        this.BORDER.LEFT, 
        this.BORDER.INNER_TOP,
        this.PLAYER_IMAGE.WIDTH,
        this.PLAYER_IMAGE.HEIGHT
      );

      // Undo
      if (playerUnit.team === 'two') {
        this.context.restore();
      }
    }

    // Active Unit Name
    this.context.lineWidth = 4;
    this.context.fillStyle = HUDSTYLES.colors.darkGray;
    this.context.strokeStyle = HUDSTYLES.colors.lightGray;
    this.context.fillRect(this.BORDER.LEFT, this.CONFIRM.TOP, this.PLAYER_IMAGE.WIDTH, this.CONFIRM.HEIGHT);
    this.context.strokeRect(this.BORDER.LEFT, this.CONFIRM.TOP, this.PLAYER_IMAGE.WIDTH, this.CONFIRM.HEIGHT);

    this.context.fillStyle = HUDSTYLES.colors.white;
    this.context.strokeStyle = HUDSTYLES.colors.white;

    let name = (playerUnit && playerUnit.metadata && playerUnit.metadata.name.toUpperCase()) || "";

    this.context.shadowColor = HUDSTYLES.colors.white;
    this.context.shadowBlur = this.shadowBlur;
    this.context.font = `${name.length > 22 ? '13' : name.length > 16 ? '14' : '16'}pt "kozuka-gothic-pr6n-bold"`;
    this.context.textAlign = 'left';
    this.context.textBaseline = "middle";
    this.context.fillText(name,
      this.BORDER.LEFT + this.TARGET_STATS.TEXT_PADDING,
      this.CONFIRM.TOP + this.CONFIRM.HEIGHT / 2
    );
    this.context.shadowBlur = 0;
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
    // Character Portrait
    let gradient = this.context.createLinearGradient(0, this.BORDER.INNER_TOP, 0, this.BORDER.INNER_TOP + this.PLAYER_IMAGE.WIDTH);
    gradient.addColorStop(0, 'rgba(36,36,36,1.0)');
    gradient.addColorStop(1.0, 'rgba(79,40,48,1.0)');
    this.context.fillStyle = gradient;
    this.context.fillRect(this.TARGET_REGION.LEFT, this.BORDER.INNER_TOP, this.PLAYER_IMAGE.WIDTH, this.PLAYER_IMAGE.HEIGHT);

    if (!this.units || !this.units.length) return;

    // Show the target
    let targetUnit = this.getTarget();

    if (targetUnit && targetUnit.headImgLoaded) {
      if (targetUnit.team === 'two') {
        this.context.save();
        this.context.translate(this.width * (36 + 17.5)/36, 0);
        this.context.scale(-1, 1);
      }

      this.context.drawImage(
        targetUnit.headImg, 
        this.TARGET_REGION.LEFT, 
        this.BORDER.INNER_TOP,
        this.PLAYER_IMAGE.WIDTH,
        this.PLAYER_IMAGE.HEIGHT
      );

      // Undo
      if (targetUnit.team === 'two') {
        this.context.restore();
      }
    }

    // Target Name
    this.context.lineWidth = 4;
    this.context.fillStyle = HUDSTYLES.colors.darkGray;
    this.context.strokeStyle = HUDSTYLES.colors.lightGray;
    this.context.fillRect(this.TARGET_REGION.LEFT, this.CONFIRM.TOP, this.PLAYER_IMAGE.WIDTH, this.CONFIRM.HEIGHT);
    this.context.strokeRect(this.TARGET_REGION.LEFT, this.CONFIRM.TOP, this.PLAYER_IMAGE.WIDTH, this.CONFIRM.HEIGHT);

    this.context.fillStyle = HUDSTYLES.colors.white;
    this.context.strokeStyle = HUDSTYLES.colors.white;

    let name = (targetUnit && targetUnit.metadata && targetUnit.metadata.name.toUpperCase()) || "Select Your Target".toUpperCase();

    this.context.shadowColor = HUDSTYLES.colors.white;
    this.context.shadowBlur = this.shadowBlur;
    this.context.font = `${name.length > 22 ? '13' : name.length > 16 ? '14' : '16'}pt "kozuka-gothic-pr6n-bold"`;
    this.context.textAlign = 'left';
    this.context.textBaseline = "middle";
    this.context.fillText(name ,
      this.TARGET_REGION.LEFT + this.TARGET_STATS.TEXT_PADDING,
      this.CONFIRM.TOP + this.CONFIRM.HEIGHT / 2
    );
    this.context.shadowBlur = 0;
  }

  drawTargetStats() {
    // Top Line
    this.context.strokeWidth = 1;
    this.context.strokeStyle = HUDSTYLES.colors.halfGray;

    this.context.beginPath();
    this.context.moveTo(this.TARGET_STATS.LEFT, this.TARGET_STATS.TOP);
    this.context.lineTo(this.TARGET_STATS.RIGHT, this.TARGET_STATS.TOP);
    this.context.stroke();

    // Font for Header
    this.context.fillStyle = HUDSTYLES.colors.neonBlue;
    this.context.strokeStyle = HUDSTYLES.colors.neonBlue;
    this.context.shadowColor = HUDSTYLES.colors.neonBlue;
    this.context.shadowBlur = this.shadowBlur;
    this.context.font = `italic 16pt "kozuka-gothic-pr6n-bold"`;
    this.context.textAlign = 'left';
    this.context.textBaseline = 'bottom';

    // Header
    this.context.textAlign = 'left';
    this.context.textBaseline = 'bottom';
    this.context.fillText("STATS", this.TARGET_STATS.LEFT + this.TARGET_STATS.TEXT_PADDING, this.TARGET_STATS.TOP - this.TARGET_STATS.TEXT_PADDING);

    // Font for Labels
    this.context.font = `14pt "kozuka-gothic-pr6n-bold"`;
    this.context.shadowBlur = 0;
    this.context.textAlign = 'center';
    this.context.fillStyle = HUDSTYLES.colors.lightGray;
    this.context.strokeStyle = HUDSTYLES.colors.lightGray;

    // Labels
    this.context.fillText("HEALTH", this.TARGET_STATS.LEFT + this.TARGET_STATS.WIDTH * 0.5 / 4, this.TARGET_STATS.TOP + this.TARGET_STATS.HEIGHT * 1.25 / 3);
    this.context.fillText("ATTACK", this.TARGET_STATS.LEFT + this.TARGET_STATS.WIDTH * 1.5 / 4, this.TARGET_STATS.TOP + this.TARGET_STATS.HEIGHT * 1.25 / 3);
    this.context.fillText("DEFENSE", this.TARGET_STATS.LEFT + this.TARGET_STATS.WIDTH * 2.5 / 4, this.TARGET_STATS.TOP + this.TARGET_STATS.HEIGHT * 1.25 / 3);
    this.context.fillText("NANO", this.TARGET_STATS.LEFT + this.TARGET_STATS.WIDTH * 3.5 / 4, this.TARGET_STATS.TOP + this.TARGET_STATS.HEIGHT * 1.25 / 3);

    this.context.fillText("STEALTH", this.TARGET_STATS.LEFT + this.TARGET_STATS.WIDTH * 0.5 / 4, this.TARGET_STATS.TOP + this.TARGET_STATS.HEIGHT * 2.25 / 3);
    this.context.fillText("MECH", this.TARGET_STATS.LEFT + this.TARGET_STATS.WIDTH * 1.5 / 4, this.TARGET_STATS.TOP + this.TARGET_STATS.HEIGHT * 2.25 / 3);
    this.context.fillText("TACTICS", this.TARGET_STATS.LEFT + this.TARGET_STATS.WIDTH * 2.5 / 4, this.TARGET_STATS.TOP + this.TARGET_STATS.HEIGHT * 2.25 / 3);
    this.context.fillText("HACKING", this.TARGET_STATS.LEFT + this.TARGET_STATS.WIDTH * 3.5 / 4, this.TARGET_STATS.TOP + this.TARGET_STATS.HEIGHT * 2.25 / 3);

    // Font for Stats
    this.context.font = `20pt "kozuka-gothic-pr6n-bold"`;
    this.context.fillStyle = HUDSTYLES.colors.white;
    this.context.strokeStyle = HUDSTYLES.colors.white;

    function statFormat(value) {
      return Math.ceil(value);
    }

    let targetUnit = this.getTarget();

    this.context.fillText(statFormat(targetUnit && targetUnit.stats && targetUnit.stats.HEALTH || 0), this.TARGET_STATS.LEFT + this.TARGET_STATS.WIDTH * 0.5 / 4, this.TARGET_STATS.TOP + this.TARGET_STATS.HEIGHT * 0.8 / 3);
    this.context.fillText(statFormat(targetUnit && targetUnit.stats && targetUnit.stats.ATTACK || 0), this.TARGET_STATS.LEFT + this.TARGET_STATS.WIDTH * 1.5 / 4, this.TARGET_STATS.TOP + this.TARGET_STATS.HEIGHT * 0.8 / 3);
    this.context.fillText(statFormat(targetUnit && targetUnit.stats && targetUnit.stats.DEFENSE || 0), this.TARGET_STATS.LEFT + this.TARGET_STATS.WIDTH * 2.5 / 4, this.TARGET_STATS.TOP + this.TARGET_STATS.HEIGHT * 0.8 / 3);
    this.context.fillText(statFormat(targetUnit && targetUnit.stats && targetUnit.stats.NANO || 0), this.TARGET_STATS.LEFT + this.TARGET_STATS.WIDTH * 3.5 / 4, this.TARGET_STATS.TOP + this.TARGET_STATS.HEIGHT * 0.8 / 3);

    this.context.fillText(statFormat(targetUnit && targetUnit.stats && targetUnit.stats.STEALTH || 0), this.TARGET_STATS.LEFT + this.TARGET_STATS.WIDTH * 0.5 / 4, this.TARGET_STATS.TOP + this.TARGET_STATS.HEIGHT * 1.8 / 3);
    this.context.fillText(statFormat(targetUnit && targetUnit.stats && targetUnit.stats.MECH || 0), this.TARGET_STATS.LEFT + this.TARGET_STATS.WIDTH * 1.5 / 4, this.TARGET_STATS.TOP + this.TARGET_STATS.HEIGHT * 1.8 / 3);
    this.context.fillText(statFormat(targetUnit && targetUnit.stats && targetUnit.stats.TACTICS || 0), this.TARGET_STATS.LEFT + this.TARGET_STATS.WIDTH * 2.5 / 4, this.TARGET_STATS.TOP + this.TARGET_STATS.HEIGHT * 1.8 / 3);
    this.context.fillText(statFormat(targetUnit && targetUnit.stats && targetUnit.stats.HACKING || 0), this.TARGET_STATS.LEFT + this.TARGET_STATS.WIDTH * 3.5 / 4, this.TARGET_STATS.TOP + this.TARGET_STATS.HEIGHT * 1.8 / 3);
  
    if (targetUnit) {
      this.drawTargetUnitStatusEffects(targetUnit);
    }
  }

  drawTargetUnitStatusEffects(unit) {
    let iconCount = 0;
    let x = this.TARGET_STATS.RIGHT - this.TARGET_STATS.TEXT_PADDING - 25;
    let y = this.TARGET_STATS.TOP - this.TARGET_STATS.TEXT_PADDING - 25;

    if (unit && unit.statusEffects && unit.statusEffects.COUNTERATTACK > 0) {
      this.drawIconEffect({
        x : x - 40 * (iconCount++), y
      }, 'COUNTERATTACK');
    }

    if (unit && unit.statusEffects && unit.statusEffects.REGENERATE > 0) {
      this.drawIconEffect({
        x : x - 40 * (iconCount++), y
      }, 'REGENERATE');
    }

    if (unit && unit.statusEffects && unit.statusEffects.POISON > 0) {
      this.drawIconEffect({
        x : x - 40 * (iconCount++), y
      }, 'POISON');
    }

    if (unit && unit.statusEffects && unit.statusEffects.SHIELD > 0) {
      this.drawIconEffect({
        x : x - 40 * (iconCount++), y
      }, 'SHIELD');
    }

    if (unit && unit.statusEffects && unit.statusEffects.TAUNT > 0) {
      this.drawIconEffect({
        x : x - 40 * (iconCount++), y
      }, 'TAUNT');
    }
  }

  drawIconEffect(position, icon) {
    if (!this.imageCache.getImage(icon)) {
      return;
    }

    // Pull down the image
    this.context.drawImage(
      this.imageCache.getImage(icon), 
      position.x,
      position.y,
      30,
      30
    );
  }

  drawSelectedAction() {
    let action = this.getSelectedAction();
    if (!action) return;

    let actionPlace = ["attack","card0","card1","card2"].indexOf(action);

    // NOTE: For some reason, this doesn't actually do anything.
    this.context.shadowBlur  = 10;
    this.context.shadowColor = "white";

    this.context.strokeStyle = HUDSTYLES.colors.white;
    this.context.lineWidth = 2.0;

    if (actionPlace === 0) {
      this.roundRect(
        this.ACTIONS.LEFT + this.cardInset * 1.25,
        this.BORDER.INNER_TOP + this.cardInset * 1.25,
        this.ACTION_BUTTON.WIDTH,
        this.ACTION_BUTTON.WIDTH,
        this.selectRoundRectRadius, false, true // Not filling in, just stroke
      );
    } else  {
      this.roundRect(
        this.width * (10 + this.cardWidthDistance * (actionPlace-1)) / 36 + this.cardInset * (2.5 - actionPlace),
        this.BORDER.INNER_TOP + this.cardInset * 1.25,
        this.ACTION_BUTTON.WIDTH,
        this.ACTION_BUTTON.WIDTH,
        this.selectRoundRectRadius, false, true // Not filling in, just stroke
      );
    }

    this.context.shadowBlur = 0;
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
        this.width * (10 + this.cardWidthDistance * cardIdx) / 36 + this.cardInset * (1.5 - cardIdx),
        this.BORDER.INNER_TOP + this.cardInset * 1.25,
        this.ACTION_BUTTON.WIDTH,
        this.ACTION_BUTTON.WIDTH,
        this.selectRoundRectRadius, false, true // Not filling in, just stroke
      );
    }
  }

  drawActions() {
    // Grey Background - Attack Button
    this.context.fillStyle = HUDSTYLES.colors.darkGray;
    this.context.fillRect(this.ACTIONS.LEFT, this.BORDER.INNER_TOP, this.ACTION_BUTTON.OUTER_WIDTH, this.ACTION_BUTTON.OUTER_WIDTH);

    // Base Attack Button, border + back -- need the border to also draw the shadow blur
    this.context.shadowColor = HUDSTYLES.colors.black;
    this.context.shadowBlur = 12;
    this.context.fillStyle = HUDSTYLES.colors.darkGray;
    this.context.strokeStyle = (this.hudLocked) ? HUDSTYLES.colors.transparentRed : HUDSTYLES.colors.red;
    this.context.lineWidth = 4;
    this.roundRect(
      this.ACTIONS.LEFT + this.cardInset * 2,
      this.BORDER.INNER_TOP + this.cardInset * 2,
      this.ACTION_BUTTON.OUTER_WIDTH - this.cardInset * 4,
      this.ACTION_BUTTON.OUTER_WIDTH - this.cardInset * 4,
      this.roundRectRadius, true, true
    );
    this.context.fillStyle = HUDSTYLES.colors.red;
    this.context.strokeStyle = HUDSTYLES.colors.red;
    this.context.shadowBlur = 0;

    // Redraw outer border
    this.context.lineWidth = 4;
    this.roundRect(
      this.ACTIONS.LEFT + this.cardInset * 2,
      this.BORDER.INNER_TOP + this.cardInset * 2,
      this.ACTION_BUTTON.OUTER_WIDTH - this.cardInset * 4,
      this.ACTION_BUTTON.OUTER_WIDTH - this.cardInset * 4,
      this.roundRectRadius, false, true
    );

    // Pull down the image
    let ATTACK_BUTTON_WIDTH = this.width * 1.5/36;
    this.context.drawImage(
      this.imageCache.getImage('ATTACK'),
      this.ACTIONS.LEFT + (this.ACTION_BUTTON.OUTER_WIDTH - ATTACK_BUTTON_WIDTH) / 2,
      this.BORDER.INNER_TOP + this.BORDER.LEFT,
      ATTACK_BUTTON_WIDTH,
      ATTACK_BUTTON_WIDTH
    );

    this.context.font = '20pt "kozuka-gothic-pr6n-bold"';
    this.context.textAlign = 'center';
    this.context.textBaseline = "middle";
    this.context.fillText("BASE ATTACK",
      this.ACTIONS.LEFT + this.ACTION_BUTTON.OUTER_WIDTH / 2,
      this.BORDER.INNER_TOP + this.width * 3/36 + this.BORDER.LEFT/2 - this.cardInset/2
    );

    this.writeTicks({
      x : this.ACTIONS.LEFT + this.ACTION_BUTTON.OUTER_WIDTH - this.cardInset - 45,
      y : this.BORDER.INNER_TOP + 50
    });

    // Grey Background - Cards
    this.context.fillStyle = HUDSTYLES.colors.darkGray;
    this.context.fillRect(this.ACTIONS.LEFT + this.ACTION_BUTTON.OUTER_WIDTH + 0.25 * this.width / 36, this.BORDER.INNER_TOP, this.PLAYER_REGION.RIGHT - this.ACTIONS.LEFT - this.ACTION_BUTTON.OUTER_WIDTH - 0.25 * this.width / 36, this.ACTION_BUTTON.OUTER_WIDTH);

    // Cards
    this.drawCard(0);
    this.drawCard(1);
    this.drawCard(2);

    // Confirm Button
    this.context.lineWidth = 4;
    this.context.fillStyle = HUDSTYLES.colors.darkGray;
    this.context.strokeStyle = (this.hudLocked) ? HUDSTYLES.colors.lightGray : HUDSTYLES.colors.white;
    this.context.fillRect(this.CONFIRM.LEFT, this.CONFIRM.TOP, this.CONFIRM.WIDTH, this.CONFIRM.HEIGHT);
    this.context.strokeRect(this.CONFIRM.LEFT, this.CONFIRM.TOP, this.CONFIRM.WIDTH, this.CONFIRM.HEIGHT);

    this.context.fillStyle = (this.hudLocked) ? HUDSTYLES.colors.lightGray : HUDSTYLES.colors.white;
    this.context.strokeStyle = (this.hudLocked) ? HUDSTYLES.colors.lightGray : HUDSTYLES.colors.white;

    this.context.font = '20pt "kozuka-gothic-pr6n-bold"';
    this.context.textAlign = 'center';
    this.context.textBaseline = "middle";
    this.context.fillText("CONFIRM",
      this.CONFIRM.LEFT + this.CONFIRM.WIDTH / 2,
      this.CONFIRM.TOP + this.CONFIRM.HEIGHT / 2
    );
  }

  drawCard(cardNum = 0) {
    if (this.cards && this.cards.length > cardNum) {
      this.cards[cardNum].update(this.playerSelections.getCard(cardNum), {isTaunted:this.playerSelections.isTaunted()});
    }
  }

  writeTicks(center, width = 45) {
    this.context.fillStyle = HUDSTYLES.colors.white;
    this.context.strokeStyle = HUDSTYLES.colors.white;

    this.context.font = '16pt "kozuka-gothic-pr6n-bold"';
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
      center.y + 12
    );
    this.context.lineTo(
      center.x + width / 2,
      center.y + 12
    );
    this.context.stroke();

    this.context.font = '10pt "kozuka-gothic-pr6n-bold"';
    this.context.textAlign = 'center';
    this.context.textBaseline = 'top';
    this.context.fillText(
      "TICKS",
      center.x,
      center.y + 16
    );
  }

}
