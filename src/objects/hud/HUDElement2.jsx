import HUDSTYLES from "../../data/hudStyles.js";

export class HUDElement2 {

  constructor(obj = {}) {
    this.div = obj.div;
    this.center = {x:obj.x, y:obj.y};
    this.width = obj.width;
    this.height = obj.height;
    this.size = {width:obj.width, height:obj.height};
    this.teams = obj.teams;
    this.unit = obj.unit;
    this.activeAnimEvt = obj.activeAnimEvt;
    this.hudLocked = true;
    this.battleComplete = false;
    this.battleCompleteWinner = null;
    this.playerSelections = null;

    window.addEventListener('clickableRegionsLocked', this.handleHUDLocked.bind(this));
    window.addEventListener('clickableRegionsUnlocked', this.handleHUDUnlocked.bind(this));
    window.addEventListener('battleComplete', this.handleBattleComplete.bind(this));
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

  update(delta) {
    // Placeholder
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
