import { Animation } from './Animation.jsx';

export class KnockoutAnimation extends Animation {

  run(event) {
    // Find the units
    let targets = this.getTargets(event);

    // Run the hit reaction for targets
    for (let _target of targets) {
      _target.knockoutAnimationPlayed = true;
      this.playAnimation(_target, 'death', 0.9, false);
      this.playEffect(_target.nftId, 'knockout-target', 0.75);
      this.playSound('combat', 'knockout-player-2', 0.75);
    }
  }

}
