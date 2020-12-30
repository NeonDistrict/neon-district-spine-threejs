import { Animation } from './Animation.jsx';
import WEAPON_ANIMATIONS_TO_EFFECTS from "../data/weaponAnimationsToEffects.js";

export class BattleCompleteAnimation extends Animation {

  run(event) {
    this.playEffect('vfx0', 'victory', 0.25);
  }

}
