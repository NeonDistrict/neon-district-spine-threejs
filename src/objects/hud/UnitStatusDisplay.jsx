import { HUDElement } from './HUDElement.jsx';
import { UnitStatus } from './UnitStatus.jsx';

export class UnitStatusDisplay extends HUDElement {

  constructor(obj) {
    super(obj);
    this.getUnitPosition = obj.getUnitPosition;
    this.statusWidth = 100;
    this.statusHeight = 100;
  }

  setTeams(teams) {
    this.teams = teams;
    this.init();
  }

  init() {
    this.units = [];
    this.unitStatuses = [];
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
      let position = this.getUnitPosition(this.units[idx].character);
      if (!position) {
        return null;
      }

      this.unitStatuses.push(new UnitStatus({
          'context'         : this.context,
          'x'               : position.x,
          'y'               : position.y,
          'width'           : this.statusWidth,
          'height'          : this.statusHeight,
          'unit'            : this.units[idx],
          'activeAnimEvt'   : this.activeAnimEvt,
          'getUnitPosition' : this.getUnitPosition
        })
      );
    }
  }

  update(delta) {
    if (!this.unitStatuses || !this.unitStatuses.length) {
      this.init();
    }

    for (let idx = 0; idx < this.unitStatuses.length; idx++) {
      this.unitStatuses[idx].update();
    }
  }

}
