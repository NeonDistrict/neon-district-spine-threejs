export class CombatAnalysis {
  constructor() {}

  static hasTaunt(unit) {
    return (unit && unit.statusEffects.TAUNT > 0 && unit.statusEffectTargets.TAUNT);
  }

  static getTaunter(unit) {
    if (this.hasTaunt(unit)) {
      return unit.statusEffectTargets.TAUNT;
    }
  }

}
