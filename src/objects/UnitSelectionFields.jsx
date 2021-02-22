export class UnitSelectionFields {

  constructor(obj) {
    this.getUnitPosition = obj.getUnitPosition;
    this.regions = [];
  }

  setTeams(teams) {
    this.teams = teams;
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
        Math.round(position.target.x / 2.0),
        Math.round(position.target.y / 2.0),
        Math.round((position.target.x + position.target.width) / 2.0),
        Math.round((position.target.y + position.target.height) / 2.0)
      ];

      this.regions.push({
        target: unit.unitId,
        region
      });
    }
  }

  getRegions() {
    return this.regions;
  }
}
