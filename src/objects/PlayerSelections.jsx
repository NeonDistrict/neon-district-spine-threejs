export class PlayerSelections {

  constructor() {
    this.clear();
  }

  clear() {
    this.action = null;
    this.target = 0;//null;
    this.cards = [{},{},{}];
  }

  setCards(_cards) {
    this.cards = JSON.parse(JSON.stringify(_cards));
  }

  getCards() {
    return this.cards;
  }

  getCard(_cardIdx) {
    if (this.cards.length >= _cardIdx && _cardIdx >= 0) {
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

    // Disallow selecting effects
    if (card.type.toLowerCase() === 'effect') {
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

}
