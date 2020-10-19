import { HUDElement } from './HUDElement.jsx';
import { UnitPortrait } from './UnitPortrait.jsx';

export class TurnOrderDisplay extends HUDElement {

  constructor(obj) {
    super(obj);

    this.unitWidth = 70;
    this.unitHeight = 70;
    this.unitSpacing = 8;
    this.verticalGap = 10;

    this.init();
  }

  setTeams(teams) {
    this.teams = teams;
    this.init();
  }

  init() {
    this.units = [];
    this.portraits = [];
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

    let numUnits = this.units.length;
    for (let idx = 0; idx < numUnits; idx++) {
      let xPos = this.center.x + 
        (this.unitWidth + this.unitSpacing) * (idx - numUnits/2) + 
        (this.unitWidth + this.unitSpacing) / 2;

      this.portraits.push(
        new UnitPortrait({
          'context' : this.context,
          'x'       : xPos,
          'y'       : this.center.y + this.unitHeight / 2 + this.verticalGap,
          'width'   : this.unitWidth,
          'height'  : this.unitHeight,
          'unit'    : this.units[idx]
        })
      );
    }

    this.constructPortraitOrder();
  }

  constructPortraitOrder() {
    this.portraits.sort((_a, _b) => {
      if (_a.unit.stats.health <= 0 && _b.unit.stats.health <= 0) {
        if (_a.unit.lastTurnOrder < _b.unit.lastTurnOrder) {
          return -1;
        }
        return 1;
      } else if (_a.unit.stats.health <= 0) {
        return 1;
      } else if (_b.unit.stats.health <= 0) {
        return -1;
      }

      if (_a.unit.ticks < _b.unit.ticks) {
        return -1;
      } else if (_b.unit.ticks < _a.unit.ticks) {
        return 1;
      } else {
        if (_a.unit.lastTurnOrder < _b.unit.lastTurnOrder) {
          return -1;
        } else {
          return 1;
        }
      }
    });
  }

  update(delta) {
    this.constructPortraitOrder();
    let numUnits = this.units.length;
    for (let idx = 0; idx < this.portraits.length; idx++) {
      let xPos = this.center.x + 
        (this.unitWidth + this.unitSpacing) * (idx - numUnits/2) + 
        (this.unitWidth + this.unitSpacing) / 2;

      this.portraits[idx].update(delta, {
        'x' : xPos
      });
    }
  }

}
