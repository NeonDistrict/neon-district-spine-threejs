import { Animation } from './Animation.jsx';

export class ShieldBlockAnimation extends Animation {

  run(event) {
    // Find the units
    let targets = this.getTargets(event);

    // Run the hit reaction for targets
    for (let _target of targets) {
      if (_target.knockoutAnimationPlayed === true) {
        continue;
      }

      this.playEffect(_target.nftId, 'shield-target', 0.9);
      this.playSound('combat', 'disarm-forcefield-1', 0.0);
    }
  }

}
