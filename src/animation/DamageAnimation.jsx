import { Animation } from './Animation.jsx';

export class DamageAnimation extends Animation {

  run(event, isKnockout = false) {
    // Find the units
    let targets = this.getTargets(event);

    // Run the hit reaction for targets
    for (let _target of targets) {
      if (_target.knockoutAnimationPlayed === true) {
        continue;
      }

      this.playAnimation(_target, 'baseHit', 0.9, true);
      this.playEffect(_target.nftId, 'hit-target-1', 0.9);
    }
  }

}
