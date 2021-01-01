import { Animation } from './Animation.jsx';
import WEAPON_ANIMATIONS_TO_SOUND from "../data/weaponAnimationsToSound.js";

export class DamageAnimation extends Animation {

  run(event, isKnockout = false) {
    // Find the units
    let invokers = this.getInvokers(event);
    let targets = this.getTargets(event);

    // Get the weapon used for the attack
    let weaponAnimationType;
    for (let _invoker of invokers) {
      weaponAnimationType = _invoker.weaponAnimationType;

      // Drones
      if (_invoker.drone) {
        weaponAnimationType = 'DroneSml';
      }
    }

    // Run the hit reaction for targets
    for (let _target of targets) {
      if (_target.knockoutAnimationPlayed === true) {
        continue;
      }

      this.playAnimation(_target, 'baseHit', 0.9, true);
      this.playEffect(_target.nftId, 'hit-target-1', 0.9);

      if (
        WEAPON_ANIMATIONS_TO_SOUND.hasOwnProperty(weaponAnimationType) &&
        WEAPON_ANIMATIONS_TO_SOUND[weaponAnimationType].hasOwnProperty('impact')
      ) {
        this.playSound('combat', WEAPON_ANIMATIONS_TO_SOUND[weaponAnimationType].impact, 0.9);
      }
    }
  }

}
