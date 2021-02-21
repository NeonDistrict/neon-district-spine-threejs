export class UnitSelectionFields {

  constructor(obj) {
    this.getUnitPosition = obj.getUnitPosition;
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
  }

  registerTargetRegions() {
    for (let unit of this.units) {
      let position = this.getUnitPosition(unit.character);
      if (!position) {
        continue;
      }

      let region = [
        position.target.x / 2.0,
        position.target.y / 2.0,
        (position.target.x + position.target.width) / 2.0,
        (position.target.y + position.target.height) / 2.0
      ];

      window.dispatchEvent(
        new CustomEvent("registerClickableRegion", {
          'detail' : {
            'option' : 'target-' + unit.unitId,
            'region' : region
          }
        })
      );
    }
  }
}
