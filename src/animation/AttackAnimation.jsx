import { Animation } from './Animation.jsx';
import WEAPON_ANIMATIONS_TO_EFFECTS from "../data/weaponAnimationsToEffects.js";
import WEAPON_ANIMATIONS_TO_SOUND from "../data/weaponAnimationsToSound.js";

export class AttackAnimation extends Animation {

  run(event) {
    // Find the units
    let invokers = this.getInvokers(event);

    // Run the attack animations for invokers
    for (let _invoker of invokers) {
      this.playAnimation(_invoker, 'baseAtk');
      this.playStatChangeAnimation(_invoker, this.getStatChanges(_invoker.unitId, event.statChanges));

      // Determine which effect we play for which weapon type
      let weaponAnimationType = _invoker.weaponAnimationType;

      // Drones
      if (_invoker.drone) {
        weaponAnimationType = 'DroneSml';
      }

      // Get the effect
      if (WEAPON_ANIMATIONS_TO_EFFECTS.hasOwnProperty(weaponAnimationType)) {
        let delay = 0.25;
        if (weaponAnimationType === "EnergySml") {
          delay = 0.85;
        } else if (weaponAnimationType.indexOf("Blade") !== -1 || weaponAnimationType.indexOf("DualMelee") !== -1) {
          delay = 0.5;
        }

        this.playEffect(_invoker.nftId, WEAPON_ANIMATIONS_TO_EFFECTS[weaponAnimationType], delay);

        if (
          WEAPON_ANIMATIONS_TO_SOUND.hasOwnProperty(weaponAnimationType) &&
          WEAPON_ANIMATIONS_TO_SOUND[weaponAnimationType].hasOwnProperty('baseAtk')
        ) {
          this.playSound('weapons', WEAPON_ANIMATIONS_TO_SOUND[weaponAnimationType].baseAtk, delay);
        }
      }
    }
  }

}
