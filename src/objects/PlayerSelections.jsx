export class PlayerSelections {

  constructor(_characters) {
    this.characters = _characters;
    this.clear();
  }

  clear() {
    this.action = null;
    this.target = null;
    this.cards = [{},{},{}];
    this.taunted = false;
    this.taunter = null;
  }

  hasSelections() {
    return this.cards && this.cards.length && Object.keys(this.cards[0]).length > 0 && this.cards[0].constructor === Object;
  }

  setCards(_cards) {
    this.cards = JSON.parse(JSON.stringify(_cards));
  }

  getCards() {
    return this.cards;
  }

  getCard(_cardIdx) {
    if (this.cards.length > _cardIdx && _cardIdx >= 0) {
      return this.cards[_cardIdx];
    }
    return false;
  }

  validateActionSelect(_option) {
    if (['attack','card0','card1','card2'].indexOf(_option) === -1) {
      return false;
    }

    if (_option === 'attack') {
      return true;
    }

    let cardIdx = _option.replace(/^card/,'');
    let card = this.getCard(cardIdx);

    // Disallow selecting effects, fillers, or interacts
    if (!card || !card.hasOwnProperty('type') ||
      card.type.toLowerCase() === 'effect' ||
      card.type.toLowerCase() === 'filler' ||
      card.type.toLowerCase() === 'interact'
    ) {
      return false;
    }

    // If taunted, disallow selecting anything except attacks
    if (this.isTaunted() && card.type.toLowerCase() !== 'attack') {
      return false;
    }

    return true;
  }

  setAction(_option) {
    if (['attack','card0','card1','card2'].indexOf(_option) !== -1) {
      this.action = _option;
    }
  }

  getAction() {
    return this.action;
  }

  validateTargetSelect(_target) {
    _target = _target.replace(/target-/,'');

    for (let char of this.characters) {
      if (char.unit.unitId === _target && char.unit.state === 'UNCONSCIOUS') {
        return false;
      }

      if (this.isTaunted() && this.getTaunter() !== _target) {
        return false;
      }
    }

    // Must be updated to consider actual targets for the given action
    if (!_target) {
      return false;
    }

    return true;
  }

  setTarget(_target) {
    _target = _target.replace(/target-/,'');

    this.target = _target;
  }

  getTarget() {
    return this.target;
  }

  isTaunted() {
    return this.taunted;
  }

  setTaunter(taunter) {
    this.taunter = taunter;
    this.taunted = !!taunter;
  }

  getTaunter() {
    return this.taunter;
  }

}
