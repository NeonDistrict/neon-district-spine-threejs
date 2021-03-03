import React, { Component } from "react";

export class HUDComponent extends Component {

  constructor(props) {
    super(props);

    this.activeAnimEvt = props.activeAnimEvt;
    this.hudLocked = true;
    this.battleComplete = false;
    this.battleCompleteWinner = null;
    this.playerSelections = null;
    this.needsUpdate = true;

    window.addEventListener('clickableRegionsLocked', this.handleHUDLocked.bind(this));
    window.addEventListener('clickableRegionsUnlocked', this.handleHUDUnlocked.bind(this));
    window.addEventListener('battleComplete', this.handleBattleComplete.bind(this));
  }

  getActivePlayer() {
    if (!this.props.units || this.props.units.length === 0) {
      return {};
    }

    return this.props.units.reduce((acc, curr) => {
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
    for (let _idx in this.props.units) {
      if (this.props.units[_idx].unitId === this.props.playerSelections.getTarget()) {
        return this.props.units[_idx];
      }
    }
  }

  setPlayerSelectionsObject(playerSelections) {
    this.playerSelections = playerSelections;
  }

  handleHUDLocked() {
    this.hudLocked = true;
  }

  handleHUDUnlocked() {
    this.hudLocked = false;
  }

  handleBattleComplete(e) {
    this.battleComplete = true;
    if (e && e.detail && e.detail.winner) {
      this.battleCompleteWinner = e.detail.winner;
    }
  }

  preUpdate(delta) {
    return this.needsUpdate;
  }

  update(delta) {
    // Placeholder
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

      if (stroke) {
          this.context.stroke();
      }

      if (fill) {
          this.context.fill();
      }
  }

  getLines(text, maxWidth) {
    if (!text || typeof text !== 'string') {
      return [];
    }

    var words = text.split(" ");
    var lines = [];
    var currentLine = words[0];

    for (var i = 1; i < words.length; i++) {
      var word = words[i];
      var width = this.context.measureText(currentLine + " " + word).width;
      if (width < maxWidth) {
        currentLine += " " + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines;
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
      default: return HUDSTYLES.colors.halfGray;
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
