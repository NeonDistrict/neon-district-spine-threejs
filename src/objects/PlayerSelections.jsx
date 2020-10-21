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

  setAction(_option) {
    if (['attack','card0','card1','card2'].indexOf(_option) !== -1) {
      this.action = _option;
    }
  }

  getAction() {
    return this.action;
  }

  setTarget(_target) {
    _target = _target.replace(/target-/,'');

    this.target = _target;
  }

  getTarget() {
    return this.target;
  }

}
